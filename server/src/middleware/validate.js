const { z } = require('zod')
 
// User schema for POST and PUT
const userSchema = z.string()
  .min(1,'Username is required')
  .max(39,'Github username max 39 chars')
  .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
    'Invalid Github username format'


  ).transform(val=>val.trim().toLowerCase());









const compareSchema=z.object({
user1:userSchema,
user2:userSchema,
}).refine(data=>data.user1!==data.user2,{
    message:'Cannot compare same user'
})
 

module.exports = { compareSchema, userSchema }
 