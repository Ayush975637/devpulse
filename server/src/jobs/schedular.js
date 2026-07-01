const Bull = require("bull");
const prisma = require("../lib/pool");
const { githubQueue } = require("../jobs/queue");

const dailyQueue = new Bull("daily-cron-jobs", process.env.REDIS_URL, {
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});


dailyQueue.add(
  {},
  {
    repeat: {
      cron: "0 0 * * *", // Every day at midnight
    },
    jobId: "daily-refresh-job",
  }
);

dailyQueue.process(async (job) => {
  console.log(
    `Running daily cron job at ${new Date().toISOString()}`
  );

  const now = new Date();

  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  );

  const threeDaysAgo = new Date(
    now.getTime() - 3 * 24 * 60 * 60 * 1000
  );

  const users = await prisma.user.findMany({
    where: {
      lastViewedAt: {
        gte: thirtyDaysAgo,
      },
      OR: [
        {
          lastSyncedAt: null,
        },
        {
          lastSyncedAt: {
            lte: threeDaysAgo,
          },
        },
      ],
    },
  });

  console.log(`Found ${users.length} users to refresh.`);

  for (const user of users) {
    console.log(`Queueing refresh job for ${user.username}`);

    await githubQueue.add(
      { username: user.username },
      {
        jobId: `refresh:${user.username}`,
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }
});

dailyQueue.on("completed", (job) => {
  console.log(`[daily] Job ${job.id} completed`);
});

dailyQueue.on("failed", (job, err) => {
  console.error(`[daily] Job ${job.id} failed:`, err.message);
});

