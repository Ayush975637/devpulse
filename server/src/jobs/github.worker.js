// server/src/jobs/github.worker.js
const { githubQueue } = require('./queue');
const { getUserProfileFresh, getUserReposFresh, getCommitActivityFresh } = require('../services/github.service');
const { computeStats2 } = require('../services/stats2.service');
const prisma = require('../lib/pool');
const cache = require('../services/cache.service');

const TTL = 60 * 60 * 12; 

githubQueue.process(async (job) => {
  const { username } = job.data;
  console.log(`[worker] processing: ${username}`);

let user;
const today = new Date();
today.setHours(0, 0, 0, 0);
user = await prisma.user.findUnique({
  where: {
    username:username,
    
    
  },
  
});

if(user&&user.lastSyncedAt&&user.lastSyncedAt>=today){
  return { username, message: 'github worker  already exists for today, skipping snapshot creation.' };
}








const [profile, repos, commitActivity] = await Promise.all([
  getUserProfileFresh(username),
  getUserReposFresh(username),
  getCommitActivityFresh(username),
]);
  // stats new file without caching, without db fallback
  const stats = await computeStats2(repos, profile, commitActivity);

  const fullData = {
    ...stats,
    commitActivity,
  };


  console.log('update in db by bullmq');

  const { heatmapData, devScore, ...stats2 } = stats;

  
  try {
    user = await prisma.$transaction(async (tx) => {
      // user upsert
      const u = await tx.user.upsert({
        where: { username: profile.username },
        update: {
          name: profile.name,
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
          lastViewedAt: new Date(),
          lastSyncedAt: new Date(),
          followers: profile.followers,
          following: profile.following,
          publicRepos: profile.public_repos,
        },
        create: {
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


      await tx.repository.deleteMany({
        where: { userId: u.id },
      });

      await tx.repository.createMany({
        data: repos.map((r) => ({
          userId: u.id,
          githubId: r.github_id,
          name: r.name,
          language: r.language,
          stars: r.stars,
          forks: r.forks,
          watchers: r.watchers,
          updatedAt: r.updatedAt,
          description: r.description,
          homepage: r.homepage,
          repoUrl: r.repo_url,
        })),
        skipDuplicates: true,
      });

      // stats upsert
      await tx.stats.upsert({
        where: { userId: u.id },
        update: {
          devScore: devScore.overall,
          stats: {
            ...stats2,
            devScore,
          },
        },
        create: {
          userId: u.id,
          devScore: devScore.overall,
          stats: {
            ...stats2,
            devScore,
          },
        },
      });


  await tx.snapshot.create({
    data: {
      userId: u.id,
      snapshotDate: today,

      totalStars: stats.totalStars,
      totalRepos: profile.public_repos,
      totalForks: stats.totalForks,
      totalWatches: stats.totalWatches,

      followers: profile.followers,

      totalCommits: stats.totalCommits,
      totalContributionsYear: stats.totalContributionsYear,

      currentStreakDays: stats.currentStreakDays,
      longestStreakDays: stats.longestStreakDays,
      activeDaysCount: stats.activeDaysCount,

      overallScore: stats.devScore.overall,
      percentile: stats.devScore.percentile,
      activeWeeks: stats.devScore.activeWeeks,

      consistencyScore: stats.devScore.breakdown.consistency,
      activityScore: stats.devScore.breakdown.activity,
      impactScore: stats.devScore.breakdown.impact,
      diversityScore: stats.devScore.breakdown.diversity,
      repositoryScore: stats.devScore.breakdown.repoScore,
      reachScore: stats.devScore.breakdown.reach,
    },
  });




























      return u;
    });
  } catch (err) {

    console.error(`[worker] DB transaction failed for ${username}:`, err.message);
    throw err;
  }

  console.log('cache save by bull mq');
  await cache.set(`stats:${username}`, fullData, TTL);
  await cache.set(`profile:${username}`, profile, TTL);
  await cache.set(`repos:${username}`, repos, TTL);

  console.log(`[worker] done: ${username}`);
  return { username };
});

githubQueue.on('completed', (job, result) => {
  console.log(`[bull] job ${job.id} completed →`, result);
});

githubQueue.on('failed', (job, err) => {
  console.error(`[bull] job ${job.id} failed → ${err.message}`);
});

githubQueue.on('stalled', (job) => {
  console.warn(`[bull] job ${job.id} stalled — retrying`);
});