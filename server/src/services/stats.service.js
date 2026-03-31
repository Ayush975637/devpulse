
const prisma = require('../lib/pool');
const cache = require('./cache.service');
require('dotenv').config();
const TTL = 60 * 60 * 12; // 6 hours


function computeDevScore(stats) {

  const safe = (val) => (isNaN(val) ? 0 : val);

  const weekly = stats.weeklyCommits || [];
  const repoScore = safe(Math.min(Math.round((stats.totalRepos / 100) * 100), 100));

  const activeWeeks = weekly.filter(w => (w || 0) > 0).length;
const totalWeeks = weekly.length || 52;


const consistency = safe(Math.min(Math.round((activeWeeks / totalWeeks) * 100), 100))
  const impact = safe(Math.min(
    Math.round(Math.log10((stats.totalStars || 0) + 1) * 40),
    100
  ));

  const diversity = safe(Math.min((stats.topLanguages?.length || 0) * 14, 100));

  const recentCommits = weekly
    .slice(-4)
    .reduce((a, b) => a + b , 0);

  const activity = safe(Math.min(Math.round((recentCommits / 20) * 100), 100));
  const followers = stats.followers || 0;
  const reach = safe(Math.min(Math.round(Math.log10(followers + 1) * 20), 100));
  const overall = Math.round(
    consistency * 0.20 * 10 +
    impact      * 0.25 * 10 +
    diversity   * 0.10 * 10 +
    activity    * 0.15 * 10+
    repoScore   * 0.10 * 10+
    reach       *0.20  *10
  );

  let label = 'Beginner';
  if (overall > 800) label = 'Elite';
  else if (overall > 600) label = 'Pro';
  else if (overall > 400) label = 'Rising Dev';
  else if (overall > 200) label = 'Intermediate';

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

    breakdown: { consistency, impact, diversity, activity,repoScore,reach }
  };
}


async function computeHeavydata(commitActivity){
const weeks =
  commitActivity?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
const allDays=weeks.flatMap(w=>w.contributionDays||[])
console.log("heavy dta computtation")


return allDays;

}










 async function computeStats(repos,profile,commitActivity){

  if (!profile?.username) throw new Error("Invalid profile");


let user = await prisma.user.findUnique({
  where: { username: profile?.username }
});


console.log("user found in stats")
if (!user) {
  user = await prisma.user.create({
    data: {
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
  console.log("user created")
}


const key=`stats:${profile?.username}`;
// cache
const cached=await cache.get(key);

if (cached) {
    console.log("✅ CACHE HIT in stass");
    return cached;
  }

  console.log("❌ CACHE MISS in stats ");

// check db 

// const user = await prisma.user.findUnique({ where: { username:profile?.username } });

const dbStats = await prisma.stats.findUnique({
  where: { userId: user?.id }
});

console.log("dbstats load from db ")
// const isStale=Date.now()-new Date(dbStats?.updatedAt).getTime()>TTL*1000;
const isStale = !dbStats?.updatedAt ||
  (Date.now() - new Date(dbStats.updatedAt).getTime() > TTL * 1000);
if(user&&dbStats&&!isStale){
 console.log("✅ DB HIT for stats ");

//  fetch heavy data 

const fullResponse={
...dbStats.stats,

// heavy data 
// commitactivity  and heatmapData
commitActivity,
heatmapData:await computeHeavydata(commitActivity)



}
console.log("data set by db hitting and cache in ")


await cache.set(key,fullResponse,TTL);


return fullResponse;

}






console.log("compute everyhting db and cache failed to reterive")



    const langMap={}
    
    repos.forEach(r=>{
        if(r.language) langMap[r.language]=(langMap[r.language] || 0) + 1;

    })



    const topLanguages=Object.entries(langMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([lang,count])=>({lang,count}));

    const totalStars=repos.reduce((sum,r)=>sum+r.stars,0);
let totalForks = repos.reduce((sum, repo) => {
  return sum + repo.forks;
}, 0);

// const safeWeekly = Array.isArray(weeklyCommits) ? weeklyCommits : [];


// const weeks=commitActivity?.weeks||[];
const weeks =
  commitActivity?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
const allDays=weeks.flatMap(w=>w.contributionDays||[])



const confidence = weeks.length ? 100 : 60;

  // const commitsByDay = Array(7).fill(0);
  // const mostActiveDay = 'N/A';

    const commitsByDay = Array(7).fill(0);
allDays.forEach(day=>{
  const d=new Date(day.date);
  commitsByDay[d.getDay()]+=day.contributionCount
})



    // safeActivity.forEach(week=>{
    //     week?.days?.forEach((count,day)=>{
    //         commitsByDay[day]+=count||0;
    //     })
    // })

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mostActiveDay=days[commitsByDay.indexOf(Math.max(...commitsByDay))];



// weekly total from heatmap
const heatmapWeekly=weeks.map(w=>
(
  w.contributionDays||[]
).reduce((sum,d)=>sum+d.contributionCount,0)
)

// streak calculation 


 let streak = 0
  let longest = 0
  let current = 0
  for (const day of [...allDays].reverse()) {
    if (day.contributionCount > 0) {
      current++
      longest = Math.max(longest, current)
    } else {
      if (streak === 0) streak = current  // current streak ends at first zero
      current = 0
    }
  }
  const currentStreakDays = streak || current
  const longestStreakDays = longest


  // most active months
  const monthMap={}
  allDays.forEach(day=>{
    const month=day.date.slice(0,7);
    monthMap[month]=(monthMap[month]||0)+day.contributionCount
  })
  // most active month
const mostActiveMonth=Object.entries(monthMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||'N/A'
// totalyear contributions
const totalContributionsYear=allDays.reduce((sum,d)=>sum+d.contributionCount,0)

const activeDaysCount=allDays.filter(d=>d.contributionCount>0).length




  const stats = { 
    
    topLanguages,
     totalStars, 
        weeklyCommits: heatmapWeekly ,
         mostActiveDay,
         
         totalRepos: repos.length,
        commitsByDay,
         followers:profile?.followers||0,
          totalCommits: totalContributionsYear || 0,
          totalForks,
          commitActivity,
          
          mostActiveMonth,
          currentStreakDays,
          longestStreakDays,
          totalContributionsYear,
          activeDaysCount,
          heatmapData:allDays,
          confidence

        
        
        };
 const devScore=computeDevScore(stats);
        const stats2={
topLanguages,
     totalStars, 
        weeklyCommits: heatmapWeekly ,
         mostActiveDay,
          totalRepos: repos.length,
        commitsByDay,
         followers:profile?.followers||0,
          totalCommits: totalContributionsYear || 0,
          totalForks,
            
          mostActiveMonth,
          currentStreakDays,
          longestStreakDays,
          totalContributionsYear,
          activeDaysCount,
          confidence,
         


        }






 

const fullData={
  ...stats,
  
  devScore
}
console.log("full data calauclated  and now save to db")
// save only light data

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
console.log("data saved in dta abse ")











await cache.set(key,fullData,TTL);

console.log("data saved in cache after api hit ")



  return fullData;

}
module.exports = { computeStats };