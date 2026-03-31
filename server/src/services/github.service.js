
const cache = require('./cache.service');
require('dotenv').config();

const prisma = require('../lib/pool');

const TTL = 60 * 60 * 12; // 6 hours

const gh = require('./tokenRotator');



const query = `
query($username:String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}`;

async function getContributions(username){

  const key=`contributions:${username}`;
const cached=await cache.get(key);
 if (cached) {
    console.log("✅ CACHE HIT for contribution");
    return cached;
  }

  console.log("❌ CACHE MISS for contribution");


  const res=await gh.post('/graphql',{
    query,
    variables:{username}
  });


  if (!res.data) {
  throw new Error("GitHub API failed");
}
console.log("cache save for activity")
 await cache.set(key,res.data,TTL);

return res.data;


}


async function getUserProfileFresh(username){

const { data } = await gh.get(`/users/${username}`);

console.log("userprofile for bullmq")
  const profile={
  
    github_id:    data.id,
    username:     data.login,
    name:         data.name,
    avatar_url:   data.avatar_url,
    bio:          data.bio,
    followers:    data.followers,
    following:    data.following,
    public_repos: data.public_repos,

  }
    return profile;

}





async function getUserReposFresh(username){
const { data } = await gh.get(`/users/${username}/repos`, {
    params: { per_page: 100, sort: 'updated' }
  });
console.log("repo bullmq")

 const repos = data.map(r => ({
    github_id:   r.id,
    name:        r.name,
    description: r.description,
    language:    r.language,
    stars:       r.stargazers_count,
    forks:       r.forks_count,
    updatedAt: r.updated_at ? new Date(r.updated_at) : null,
    homepage:    r.homepage || null, 
  repo_url:    r.html_url,  
  }));


  return repos;



}



async function getCommitActivityFresh(username){


  console.log("activity for bullmq")
const res=await gh.post('/graphql',{
    query,
    variables:{username}
  });


  if (!res.data) {
  throw new Error("GitHub API failed");
}

return res.data;



}











async function getUserProfile(username){
const key=`profile:${username}`;

// 1 redis
const cached=await cache.get(key);
 if (cached) {
    console.log("✅ CACHE HIT for profile");
    return cached;
  }

  console.log("❌ CACHE MISS for profile");


// check db

const user = await prisma.user.findUnique({
    where: { username }
  });


  if (user) {
    console.log("✅ DB HIT for profile ");

    const profile = {
      github_id: user.githubId,
      username: user.username,
      name: user.name,
      avatar_url: user.avatarUrl,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      public_repos: user.publicRepos
    };

    await cache.set(key, profile, TTL);
    return profile;
  }


console.log("api call for profile")
  const { data } = await gh.get(`/users/${username}`);


  const profile={
  
    github_id:    data.id,
    username:     data.login,
    name:         data.name,
    avatar_url:   data.avatar_url,
    bio:          data.bio,
    followers:    data.followers,
    following:    data.following,
    public_repos: data.public_repos,

  }

// db save

  // await prisma.user.upsert({
  //     where:  { username: profile.username },
  //     update:profile,
  //     create: profile
      
  //   });
  console.log("profile save in db")
  await prisma.user.upsert({
  where: { username: profile.username },
  update: {
    name:        profile.name,
    avatarUrl:   profile.avatar_url,    // ← camelCase
    bio:         profile.bio,
    followers:   profile.followers,
    following:   profile.following,
    publicRepos: profile.public_repos,  // ← camelCase
  },
  create: {
    githubId:    profile.github_id,     // ← camelCase
    username:    profile.username,
    name:        profile.name,
    avatarUrl:   profile.avatar_url,    // ← camelCase
    bio:         profile.bio,
    followers:   profile.followers,
    following:   profile.following,
    publicRepos: profile.public_repos,  // ← camelCase
  }
})



console.log("profile save in cache")
  await cache.set(key,profile,TTL);
  return profile;





}



async function getUserRepos(username,userId){

  
 const key = `repos:${username}`;
// 1 redis
console.log("chack cache for repos")
  const cached = await cache.get(key);
  
  if (cached) {
    console.log("✅ CACHE HIT for repos");
    return cached;
  }

let uid = userId
  if (!uid) {
    const user = await prisma.user.findUnique({ where: { username } })
    uid = user?.id
  }
console.log("DB USER ID for repos:", uid)

// // check db 
// const user = await prisma.user.findUnique({
//     where: { username }
//   });

// console.log("DB USER:", user);

  if (uid) {
    // 3. DB repos
    const dbRepos = await prisma.repository.findMany({
      where: { userId: uid }
    });

    if (dbRepos.length > 0) {
      console.log("✅ DB REPOS HIT");

      const repos = dbRepos.map(r => ({
        github_id: r.githubId,
        name: r.name,
        language: r.language,
        stars: r.stars,
        forks: r.forks,
        updatedAt: r.updatedAt ,
        description: r.description,
        homepage: r.homepage,
        repo_url: r.repoUrl
      }));
 console.log("cahe after db fetching")
      await cache.set(key, repos, TTL);
      return repos;
    }
  }






console.log("api calling for repos")
// api calling 
const { data } = await gh.get(`/users/${username}/repos`, {
    params: { per_page: 100, sort: 'updated' }
  });


 const repos = data.map(r => ({
    github_id:   r.id,
    name:        r.name,
    description: r.description,
    language:    r.language,
    stars:       r.stargazers_count,
    forks:       r.forks_count,
    updatedAt: r.updated_at ? new Date(r.updated_at) : null,
    homepage:    r.homepage || null, 
  repo_url:    r.html_url,  
  }));


// db save 




if (uid) {
console.log("repos savd in db ")
await prisma.repository.deleteMany({
  where: { userId: uid}
});



    const result=await prisma.repository.createMany({
      data: repos.map(r => ({
        userId: uid,
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
   console.log("✅ REPOS SAVED:", result.count)
    
  }else{
        console.log("⚠️ No userId — repos not saved to DB")
  }




console.log("save cache repo after api and   db ")
await cache.set(key, repos, TTL);
  return repos;



}

function buildWeeklyArray(weeklyMap){

const arr=Array(52).fill(0);
const today = new Date();
for (let i = 0; i < arr.length; i++) {
  // go back by  52 weeks and chaneg
  
const date = new Date(today);
    date.setDate(today.getDate() - (51 - i) * 7); // oldest week first

    const key = getWeekKey(date);
    arr[i] = weeklyMap[key] || 0;

}
return arr;

}


function getWeekKey(date) {
  const year = date.getFullYear()
  
  const startOfYear = new Date(year, 0, 1)  // Jan 1
  const diff = date - startOfYear           // ms difference
  const dayOfYear = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const weekNum = Math.ceil(dayOfYear / 7)
  
  return `${year}-W${weekNum}`
}



async function getCommitActivity(username) {
  const key = `commits:${username}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  try {
    // search commits across ALL repos — not just owned ones
    const { data } = await gh.get('/search/commits', {
      params: {
        q: `author:${username}`,
        sort: 'author-date',
        order: 'desc',
        per_page: 100
      },
      headers: {
        Accept: 'application/vnd.github.cloak-preview+json'
      }
    });

    const commits = data.items || [];
    const totalCommits = data.total_count || 0;

    // build weekly map from commit dates
    const weeklyMap = {};
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const weekKey = getWeekKey(date);
      weeklyMap[weekKey] = (weeklyMap[weekKey] || 0) + 1;
    });

    const weeklyCommits = buildWeeklyArray(weeklyMap);

    const result = { weeklyCommits, totalCommits };

    if (commits.length > 0) {
      await cache.set(key, result, TTL);
    }

    return result;

  } catch (err) {
    console.error('commit fetch failed', err.message);
    return { weeklyCommits: Array(52).fill(0), totalCommits: 0 };
  }
}



























module.exports={getUserProfile,getUserRepos,getCommitActivity,getContributions,getCommitActivityFresh,getUserProfileFresh,getUserReposFresh}