const axios=require('axios')
const cache = require('./cache.service');
require('dotenv').config();

const TTL = 60 * 60 * 6; // 6 hours

const gh = require('./tokenRotator');
// const gh=axios.create({

//  baseURL: 'https://api.github.com',
//   headers: {
//     Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
//     Accept: 'application/vnd.github+json',
//   }






// })


async function getUserProfile(username){
const key=`profile:${username}`;
const cached=await cache.get(key);
 if (cached) {
    console.log("✅ CACHE HIT");
    return cached;
  }

  console.log("❌ CACHE MISS");




if(cached) return cached;


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
  await cache.set(key,profile,TTL);
  return profile;





}

async function getUserRepos(username){

 const key = `repos:${username}`;
  const cached = await cache.get(key);
  if (cached) return cached;

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
    updated_at:  r.updated_at,
  }));


await cache.set(key, repos, TTL);
  return repos;



}

async function getCommitActivity(username){

const key = `commits:${username}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  const repos=await getUserRepos(username);
  const topRepos=[...repos].sort((a,b)=>b.stars-a.stars).slice(0,5);

  const activity=await Promise.all(
    topRepos.map(repo=>
        gh.get(`/repos/${username}/${repo.name}/stats/commit_activity`)
        .then(r => r.data)
        .catch(() => [])
    )

  )


  await cache.set(key, activity, TTL);
  return activity;


}




module.exports={getUserProfile,getUserRepos,getCommitActivity}