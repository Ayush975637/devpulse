
const prisma = require("../lib/pool");
const cache = require("./cache.service");
require("dotenv").config();
const TTL = 60 * 60 * 12; // 12 hours

const safe = (val) => (isNaN(val) || val === undefined || val === null ? 0 : val);

function computeDevScore(stats) {
  const {
    totalWatches = 0,
    totalStars = 0,
    totalForks = 0,
    totalRepos = 0,
    topLanguages = [],
    weeklyCommits = [],
    currentStreakDays = 0,
    longestStreakDays = 0,
    lastMonthCommits = 0,
    totalContributionsYear = 0,
    followers = 0,
  } = stats;

  const weekly = weeklyCommits || [];

  // --- repoScore ---
  const repoScore = safe(
    Math.min(
      100,
      Math.round(
        Math.log10(totalWatches + 1) * 15 +
          Math.log10(totalStars + 1) * 35 +
          Math.log10(totalForks + 1) * 30 +
          Math.log10(topLanguages.length + 1) * 10 +
          Math.log10(totalRepos + 1) * 10,
      ),
    ),
  );

  // --- consistency ---
  const activeWeeks = weekly.filter((w) => (w || 0) > 0).length;

  const consistency = safe(
    Math.min(
      100,
      Math.round(
        (activeWeeks / Math.max(weekly.length || 52, 1)) * 70 +
          Math.min(Math.log10(currentStreakDays + 1) * 15, 15) +
          Math.min(Math.log10(lastMonthCommits + 1) * 15, 15),
      ),
    ),
  );

  // --- impact ---
  const impact = safe(
    Math.min(
      100,
      Math.round(
        Math.log10(totalForks + 1) * 60 +
          Math.log10(totalWatches + 1) * 20 +
          Math.log10(totalStars + 1) * 20,
      ),
    ),
  );

  // --- diversity (language entropy) ---
  // topLanguages entries are { lang, count } objects (see computeStats)
  const total = topLanguages.reduce((s, l) => s + (l.count || 0), 0);

  let diversity = 0;
  if (total > 0) {
    diversity = topLanguages.reduce((score, lang) => {
      const p = lang.count / total;
      if (p <= 0) return score;
      return score - p * Math.log2(p);
    }, 0);

    const maxEntropy = Math.log2(topLanguages.length || 1);
    diversity = maxEntropy ? Math.round((diversity / maxEntropy) * 100) : 0;
  }
  diversity = safe(diversity);

  // --- activity ---
  const activity = safe(
    Math.min(
      100,
      Math.round(
        Math.log10(totalContributionsYear + 1) * 25 +
          Math.log10(currentStreakDays + 1) * 35 +
          Math.log10(longestStreakDays + 1) * 30 +
          ((activeWeeks + 1) / 52) * 10,
      ),
    ),
  );

  // --- reach ---
  const reach = safe(
    Math.min(
      100,
      Math.round(
        Math.log10(followers + 1) * 40 +
          Math.log10(totalStars + 1) * 40 +
          Math.log10(totalForks + 1) * 20,
      ),
    ),
  );

  const overall = Math.round(
    consistency * 0.2 * 10 +
      impact * 0.25 * 10 +
      diversity * 0.1 * 10 +
      activity * 0.15 * 10 +
      repoScore * 0.1 * 10 +
      reach * 0.2 * 10,
  );

  let label = "Beginner";
  if (overall > 800) label = "Elite";
  else if (overall > 600) label = "Pro";
  else if (overall > 400) label = "Rising Dev";
  else if (overall > 200) label = "Intermediate";

  let percentile = 50;
  if (overall > 800) percentile = 3;
  else if (overall > 650) percentile = 15;
  else if (overall > 500) percentile = 30;
  else if (overall > 350) percentile = 45;

  return {
    overall,
    label,
    percentile,
    activeWeeks,
    breakdown: { consistency, impact, diversity, activity, repoScore, reach },
  };
}

async function computeHeavydata(commitActivity) {
  const weeks =
    commitActivity?.data?.user?.contributionsCollection?.contributionCalendar
      ?.weeks || [];
  const allDays = weeks.flatMap((w) => w.contributionDays || []);
  return allDays;
}

async function computeStats(repos, profile, commitActivity) {
  if (!profile?.username) throw new Error("Invalid profile");

  let user = await prisma.user.findUnique({
    where: { username: profile?.username },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        githubId: profile.github_id,
        username: profile.username,
        name: profile.name,
        lastViewedAt: new Date(),
        lastSyncedAt: new Date(),
        
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        publicRepos: profile.public_repos,
      },
    });
  }

  const key = `stats:${profile?.username}`;

  const cached = await cache.get(key);
  if (cached) {
    return cached;
  }

  const dbStats = await prisma.stats.findUnique({
    where: { userId: user?.id },
  });

  const isStale =
    !dbStats?.updatedAt ||
    Date.now() - new Date(dbStats.updatedAt).getTime() > TTL * 1000;

  if (user && dbStats && !isStale) {
    const fullResponse = {
      ...dbStats.stats,
      commitActivity,
      heatmapData: await computeHeavydata(commitActivity),
    };

    await cache.set(key, fullResponse, TTL);
    return fullResponse;
  }

  // --- recompute everything ---

  const langMap = {};
  repos.forEach((r) => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  });

  const topLanguages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ lang, count }));

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
  const totalWatches = repos.reduce((sum, r) => sum + (r?.watchers || 0), 0);

  const weeks =
    commitActivity?.data?.user?.contributionsCollection?.contributionCalendar
      ?.weeks || [];
  const allDays = weeks.flatMap((w) => w.contributionDays || []);

  const confidence = weeks.length ? 100 : 60;

  const commitsByDay = Array(7).fill(0);
  allDays.forEach((day) => {
    const d = new Date(day.date);
    commitsByDay[d.getDay()] += day.contributionCount;
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const mostActiveDay = days[commitsByDay.indexOf(Math.max(...commitsByDay))];

  // weekly total from heatmap
  const heatmapWeekly = weeks.map((w) =>
    (w.contributionDays || []).reduce((sum, d) => sum + d.contributionCount, 0),
  );

  // --- streak calculation ---
  let streak = 0;
  let longest = 0;
  let current = 0;
  for (const day of [...allDays].reverse()) {
    if (day.contributionCount > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      if (streak === 0) streak = current; // current streak ends at first zero
      current = 0;
    }
  }
  const currentStreakDays = streak || current;
  const longestStreakDays = longest;

  // --- most active month ---
  const monthMap = {};
  allDays.forEach((day) => {
    const month = day.date.slice(0, 7);
    monthMap[month] = (monthMap[month] || 0) + day.contributionCount;
  });
  const mostActiveMonth =
    Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // --- total year contributions ---
  const totalContributionsYear = allDays.reduce(
    (sum, d) => sum + d.contributionCount,
    0,
  );

  // --- last month activity (active days in the last ~4 full weeks) ---
  // NOTE: this counts ACTIVE DAYS, not raw commit counts. Renamed for clarity.
  let activeDaysLastMonth = 0;
  const recentWeeks = weeks.slice(-4);
  recentWeeks.forEach((week) => {
    (week.contributionDays || []).forEach((day) => {
      if (day.contributionCount > 0) activeDaysLastMonth++;
    });
  });
  // kept as `lastMonthCommits` for backward compatibility with stored schema/devScore inputs
  const lastMonthCommits = activeDaysLastMonth;

  const activeDaysCount = allDays.filter((d) => d.contributionCount > 0).length;

  const stats = {
    topLanguages,
    totalStars,
    weeklyCommits: heatmapWeekly,
    mostActiveDay,
    totalWatches,
    totalRepos: repos.length,
    commitsByDay,
    followers: profile?.followers || 0,
    totalCommits: totalContributionsYear || 0,
    totalForks,
    commitActivity,
    lastMonthCommits,
    mostActiveMonth,
    currentStreakDays,
    longestStreakDays,
    totalContributionsYear,
    activeDaysCount,
    heatmapData: allDays,
    confidence,
  };

  const devScore = computeDevScore(stats);

  const stats2 = {
    topLanguages,
    totalStars,
    weeklyCommits: heatmapWeekly,
    mostActiveDay,
    totalRepos: repos.length,
    commitsByDay,
    lastMonthCommits,
    followers: profile?.followers || 0,
    totalCommits: totalContributionsYear || 0,
    totalForks,
    totalWatches,
    mostActiveMonth,
    currentStreakDays,
    longestStreakDays,
    totalContributionsYear,
    activeDaysCount,
    confidence,
  };

  const fullData = {
    ...stats,
    devScore,
  };

  await prisma.stats.upsert({
    where: { userId: user.id },
    update: {
      devScore: devScore.overall,
      stats: {
        ...stats2,
        devScore,
      },
    },
    create: {
      userId: user.id,
      devScore: devScore.overall,
      stats: {
        ...stats2,
        devScore,
      },
    },
  });

  await cache.set(key, fullData, TTL);

  return fullData;
}

module.exports = { computeStats };