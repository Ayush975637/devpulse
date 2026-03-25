
// server/src/routes/github.js
const express = require('express');
const { getUserProfile, getUserRepos, getCommitActivity } = require('../services/github.service');
const { computeStats } = require('../services/stats.service');
const { githubQueue } = require('../jobs/queue');
const prisma = require('../lib/pool');
const axios = require('axios');
const router = express.Router();
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/compare',async(req,res)=>{
try{
const {u1,u2}=req.query;
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























router.get('/roast/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });
console.log(user);
    const snapshot = await prisma.snapshot.findFirst({
      where: { userId: user.id },
      orderBy: { snapshotDate: 'desc' }
    });

    if (!snapshot) return res.status(404).json({ error: 'No data yet — search profile first' });

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

    // const response = await axios.post(
    //   'https://api.anthropic.com/v1/messages',
    //   {
    //     model: 'claude-sonnet-4-20250514',
    //     max_tokens: 150,
    //     messages: [{ role: 'user', content: prompt }]
    //   },
    //   {
    //     headers: {
    //       'x-api-key': process.env.ANTHROPIC_API_KEY,
    //       'anthropic-version': '2023-06-01',
    //       'content-type': 'application/json',
    //     }
    //   }
    // );

    // const roast = response.data.content[0].text;
    // res.json({ roast, username });



 

    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-flash",
    // });

//     const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash-latest"
// });
//     const result = await model.generateContent(prompt);



const response = await genAI.models.generateContent({
   model: "gemini-1.5-flash",
    contents: prompt,
   
  });
    const roast = response.text();

    res.json({ roast, username });








  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate insight' });
  }
});



















// existing route — now also saves snapshot via Prisma
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const [profile, repos, commitActivity] = await Promise.all([
      getUserProfile(username),
      getUserRepos(username),
      getCommitActivity(username),
    ]);

    const stats = computeStats(repos, commitActivity);

    const user = await prisma.user.upsert({
      where:  { username: profile.username },
      update: { name: profile.name, avatarUrl: profile.avatar_url, bio: profile.bio },
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
        ${user.id}, CURRENT_DATE, ${stats.totalStars},
        ${JSON.stringify(stats.topLanguages)}::jsonb,
        ${JSON.stringify(stats.commitsByDay)}::jsonb
      )
      ON CONFLICT (user_id, snapshot_date) DO UPDATE SET
        total_stars    = EXCLUDED.total_stars,
        top_languages  = EXCLUDED.top_languages,
        commits_by_day = EXCLUDED.commits_by_day
    `;

    res.json({ profile, repos, stats });

  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'User not found' });
    if (err.response?.status === 403) return res.status(429).json({ error: 'Rate limit hit' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// window function analytics — the raw SQL depth
router.get('/analytics/:username', async (req, res) => {
  try {
    const { username } = req.params;

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

// queue a background refresh
router.post('/refresh/:username', async (req, res) => {
  try {
    const { username } = req.params;
console.log(username)
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

// poll job status from frontend
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