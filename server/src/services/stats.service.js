

function computeDevScore(stats,profile){

    const activeDays=stats.commitsByDay.filter(d=>d>0)?.length;
    const consistency=Math.round((activeDays/7)*100);

    const impact=Math.min(Math.round(Math.log10(stats.totalStars+1)*20),100);

    const diversity=Math.min(stats.topLanguages.length*15,100);



 const activity = Math.min(Math.round((stats.totalRepos / 50) * 100), 100);


 const overall = Math.round(
    consistency * 0.25 * 10 +
    impact      * 0.35 * 10 +
    diversity   * 0.15 * 10 +
    activity    * 0.25 * 10
  );



let percentile = 'top 50%';
  if (overall > 800) percentile = 'top 3%';
  else if (overall > 650) percentile = 'top 15%';
  else if (overall > 500) percentile = 'top 30%';














 return { overall, consistency, impact, diversity, activity, percentile };

}



























function computeStats(repos,commitActivity){


    const langMap={}
    
    repos.forEach(r=>{
        if(r.language) langMap[r.language]=(langMap[r.language] || 0) + 1;

    })



    const topLanguages=Object.entries(langMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([lang,count])=>({lang,count}));

    const totalStars=repos.reduce((sum,r)=>sum+r.stars,0);

    const commitsByDay = Array(7).fill(0);
    commitActivity.flat().forEach(week=>{
        week?.days?.forEach((count,day)=>{
            commitsByDay[day]+=count;
        })
    })

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mostActiveDay=days[commitsByDay.indexOf(Math.max(...commitsByDay))];

  const stats = { topLanguages, totalStars, commitsByDay, mostActiveDay, totalRepos: repos.length };
  const devScore=computeDevScore(stats,{});



  return {
...stats,devScore


  }

}
module.exports = { computeStats };