// server/src/jobs/github.worker.js
const { githubQueue } = require('./queue');
const { getUserProfileFresh, getUserReposFresh, getCommitActivityFresh } = require('../services/github.service');
const { computeStats2 } = require('../services/stats2.service');
const prisma = require('../lib/pool');
const cache = require('../services/cache.service')




const TTL = 60 * 60 * 12; // 6 hours
githubQueue.process(async (job) => {
  const { username } = job.data;
  console.log(`[worker] processing: ${username}`);

  
const profile = await getUserProfileFresh(username)

const repos = await getUserReposFresh(username)
const commitActivity=await getCommitActivityFresh(username)


// stats new file without caching withou db fallback 
  const stats =await computeStats2(repos,profile, commitActivity);


  const fullData={
    ...stats,
    commitActivity
  }

console.log("cache save by bull mq")
await cache.set(`stats:${username}`, fullData, TTL);
await cache.set(`profile:${username}`, profile, TTL);
await cache.set(`repos:${username}`, repos, TTL);


console.log("update in db bybullmq")
// user update 
const user = await prisma.user.upsert({
    where: { username: profile.username },
    update: {
      name: profile.name,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos
    },
    create: {
      githubId: profile.github_id,
      username: profile.username,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos
    }
  });
// repo update 


    await prisma.repository.createMany({
      data: repos.map(r => ({
        userId: user.id,
        githubId: r.github_id,
        name: r.name,
        language: r.language,
        stars: r.stars,
        forks: r.forks,
        updatedAt: r.updatedAt,
        description: r.description,
        homepage: r.homepage,
        repoUrl: r.repo_url
      })),
      skipDuplicates: true
    });


const {

heatmapData,
devScore,
...stats2

}=stats


// stats update 
await prisma.stats.upsert({
where:{userId:user.id},
update:{
  devScore:devScore.overall,
  stats:{
    ...stats2,
    devScore
  }
},
create:{
  userId:user.id,
  devScore:devScore.overall,
  stats:{
    ...stats2,
    devScore
  }
}


})





  

  
 
  console.log(`[worker] done: ${username}`);
  return { username};
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