// server/src/jobs/github.worker.js
const { githubQueue } = require('./queue');
const { getUserProfile, getUserRepos, getCommitActivity } = require('../services/github.service');
const { computeStats } = require('../services/stats.service');
const prisma = require('../lib/pool');

githubQueue.process(async (job) => {
  const { username } = job.data;
  console.log(`[worker] processing: ${username}`);

  const [profile, repos, commitActivity] = await Promise.all([
    getUserProfile(username),
    getUserRepos(username),
    getCommitActivity(username),
  ]);

  const stats = computeStats(repos, commitActivity);

  const user = await prisma.user.upsert({
    where:  { username: profile.username },
    update: {
      name:      profile.name,
      avatarUrl: profile.avatar_url,
      bio:       profile.bio,
    },
    create: {
      githubId:  profile.github_id,
      username:  profile.username,
      name:      profile.name,
      avatarUrl: profile.avatar_url,
      bio:       profile.bio,
    }
  });

  await prisma.$executeRaw`
    INSERT INTO snapshots (user_id, snapshot_date, total_stars, top_languages, commits_by_day)
    VALUES (
      ${user.id},
      CURRENT_DATE,
      ${stats.totalStars},
      ${JSON.stringify(stats.topLanguages)}::jsonb,
      ${JSON.stringify(stats.commitsByDay)}::jsonb
    )
    ON CONFLICT (user_id, snapshot_date) DO UPDATE SET
      total_stars    = EXCLUDED.total_stars,
      top_languages  = EXCLUDED.top_languages,
      commits_by_day = EXCLUDED.commits_by_day
  `;

  console.log(`[worker] done: ${username} — ${stats.totalStars} stars`);
  return { username, totalStars: stats.totalStars };
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