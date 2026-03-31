
// server/src/routes/github.js
const express = require('express');
const { getUserProfile, getUserRepos, getCommitActivity,getContributions } = require('../services/github.service');
const { computeStats } = require('../services/stats.service');
const { githubQueue } = require('../jobs/queue');
const prisma = require('../lib/pool');
const { GoogleGenAI } =require("@google/genai");
const router = express.Router();
const dotenv = require("dotenv");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
const {userSchema,compareSchema}=require('../middleware/validate')
dotenv.config();
const { profileLimiter, roastLimiter } = require('../middleware/rateLimiter');
const { parse } = require('path');

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);





router.get('/leaderboard/:page',async(req,res)=>{

  
try{
 
 
const page = parseInt(req.params.page) || 1;
console.log(page)
const limit=10;
const skip=(page-1)*limit;



const users=await prisma.stats.findMany({
orderBy:{devScore:'desc'},
skip,
take:limit,
include:{
  user:{
    select:{
      username:true,
      name:true,
      avatarUrl:true
    }
  }
}





})




const top3=await prisma.stats.findMany({
  orderBy:{devScore:'desc'},
  take:3,
  include:{
  user:{
    select:{
      username:true,
      name:true,
      avatarUrl:true
    }
  }
  }
})



const total=await prisma.stats.count();

totalPages=Math.ceil(total/limit);

if (page > totalPages) {
  return res.json({
    page,
    totalPages,
    top3: [],
    data: []
  });
}



res.json({
page,
totalPages:totalPages,
top3,
data:users?.map((u,index)=>({
 rank:skip+index+1,
 username:u.user?.username,
 name:u.user?.name,
 avatar:u.user?.avatarUrl,
 score:u.devScore,
 label:u.stats?.devScore?.label
}))})









}
catch(err){

res.status(500).json({error:'Leaderboard failed'});

}









})















router.get('/contributions/:username', async (req, res) => {
  try {
 
const username=req.params.username;
console.log("Fetching contributions for:", username);
    const contributions = await getContributions(username);
    
console.log("Contributions fetched:", contributions);

    return res.json(contributions);  
  }
  catch(err){
    return res.status(400).json({
      error: err?.message || 'Error fetching contributions'
    })
  }
 

})





// compare route
router.get('/compare/:user1/:user2',async(req,res)=>{
try{

 const result = compareSchema.safeParse(req.params);


 if (!result.success) {
    return res.status(400).json({ 
      error: result.error.errors[0].message 
    });
  }
const {u1,u2}=result.data;
if(!u1||!u2){
  return res.status(400).json({error:'Provide u1 and u2 query params proper format'})
}

const [d1,d2]=await Promise.all([
  fetchFullProfile(u1),
  fetchFullProfile(u2)

])
res.json({user1:d1,user2:d2});

}
catch(err){
  console.log(err)
res.status(500).json({error:'compare failed'})

}

}
)

async function fetchFullProfile(username){
  const [profile,repos,commitActivity]=await Promise.all([


  getUserProfile(username),
    getUserRepos(username),
    getCommitActivity(username),


  ]);

  const stats = computeStats(repos, commitActivity);
  return {profile,stats};
}












// ai roast  route 
router.get('/roast/:username',roastLimiter, async (req, res) => {
  try {

const result=userSchema.safeParse(req.params.username)

if(!result.success){
  return res.status(400).json({
    error:result.error.issues[0].message
  })
}
const username=result.data;
console.log(username);

    

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });
console.log(user);
    const snapshot = await prisma.snapshot.findFirst({
      where: { userId: user.id },
      orderBy: { snapshotDate: 'desc' }
    });

    if (!snapshot) return res.status(404).json({ error: 'No data yet — search profile first' });
console.log(snapshot);
    // send YOUR processed data to Claude — not raw GitHub
    const prompt = `
      You are a witty but fair dev analyst. Given these developer stats, write exactly 2 sentences.
      First sentence: a funny observation about their coding habits.
      Second sentence: a genuine insight about their strengths.
      Keep it under 60 words total. No hashtags, no emojis.

      Developer: ${username}
      Total stars: ${snapshot.totalStars}
      Top languages: ${JSON.stringify(snapshot.topLanguages)}
      Commits by day (Sun-Sat): ${JSON.stringify(snapshot.commitsByDay)}

      Most active day: the day with highest commits
    `;

const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

const roast = response.text;

    res.json({ roast, username });

  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate insight' });
  }
});






















// profile route
router.get('/profile/:username',profileLimiter, async (req, res) => {
  try {

const result=userSchema.safeParse(req.params.username)

if(!result.success){
  return res.status(400).json({
    error:result?.error.issues[0]?.message
  })
}
const username=result.data;

    // const [profile, repos,commitActivity] = await Promise.all([
    //   getUserProfile(username),
    //   getUserRepos(username),
    //   getContributions(username)
     
    // ]);
const profile = await getUserProfile(username)
const savedUser = await prisma.user.findUnique({ where: { username } })

const repos = await getUserRepos(username,savedUser?.id)
const commitActivity=await getContributions(username)


    // const {weeklyCommits,totalCommits} = await getCommitActivity(username);

    
const stats =await computeStats(repos,profile,commitActivity);











    // await prisma.$executeRaw`
    //   INSERT INTO snapshots (user_id, snapshot_date, total_stars, top_languages, commits_by_day)
    //   VALUES (
    //     ${user.id}, CURRENT_DATE, ${stats.totalStars},
    //     ${JSON.stringify(stats.topLanguages)}::jsonb,
    //     ${JSON.stringify(stats.commitsByDay)}::jsonb
    //   )
    //   ON CONFLICT (user_id, snapshot_date) DO UPDATE SET
    //     total_stars    = EXCLUDED.total_stars,
    //     top_languages  = EXCLUDED.top_languages,
    //     commits_by_day = EXCLUDED.commits_by_day
    // `;


console.log("bullmq start");
githubQueue.add(
  { username },
  {
    jobId: `refresh:${username}`,
    removeOnComplete:true,
    removeOnFail:true
  }
);
console.log("bullmq end")

    res.json({ profile, repos, stats });

  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'User not found' });
    if (err.response?.status === 403) return res.status(429).json({ error: 'Rate limit hit' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



























// anyltics route
router.get('/analytics/:username', async (req, res) => {
  try {
   const result=userSchema.safeParse(req.params)

if(!result.success){
  return res.status(400).json({
    error:result.error.errors[0].message
  })
}
const username=result.data;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const growth = await prisma.$queryRaw`
      SELECT
        snapshot_date,
        total_stars,
        total_stars - LAG(total_stars)
          OVER (ORDER BY snapshot_date) AS weekly_growth,
        ROUND(
          100.0 * (total_stars - LAG(total_stars) OVER (ORDER BY snapshot_date))
          / NULLIF(LAG(total_stars) OVER (ORDER BY snapshot_date), 0),
          2
        ) AS growth_percent
      FROM snapshots
      WHERE user_id = ${user.id}
      ORDER BY snapshot_date DESC
      LIMIT 30
    `;

    res.json({ growth });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// refresh route
router.post('/refresh/:username', async (req, res) => {
  try {
  const result=UserSchema.safeParse(req.params)

if(!result.success){
  return res.status(400).json({
    error:result.error.errors[0].message
  })
}
const username=result.data;
    const job = await githubQueue.add(
      { username },
      { jobId: `refresh-${username}` }  // prevents duplicate jobs
    );

    res.json({ jobId: job.id, message: 'Refresh queued' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to queue job' });
  }
});

// job route
router.get('/job/:jobId', async (req, res) => {
  try {
    const job = await githubQueue.getJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const state  = await job.getState();
    const result = job.returnvalue;
    const failed = job.failedReason;

    res.json({ state, result, failed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;