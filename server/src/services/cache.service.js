const {createClient}=require('redis')
const client = createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error)

const cache={
  async get(key){
const data=await client.get(key)
return data? JSON.parse(data):null;


  },
  async set(key,value,ttlSeconds){
    await client.setEx(key,ttlSeconds,JSON.stringify(value));
  },

  async del(key){
    await client.del(key);
  }




}



module.exports = cache;