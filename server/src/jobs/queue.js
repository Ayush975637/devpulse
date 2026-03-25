const Bull=require('bull')



const githubQueue=new Bull('github-refresh',{

redis:process.env.REDIS_URL,
defaultJobOptions:{
attempts:3,
backoff:{
 type:'exponential',
 delay:2000,

},
removeOnComplete:100,
removeOnFail:50,







}










})
module.exports={githubQueue};