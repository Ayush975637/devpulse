const rateLimit = require('express-rate-limit');



const apiLimiter=rateLimit({
windowMs:15*60*1000,
max:100,
message:{
    error:'Too many requests ,try again in 15 minutes'
},
standardHeaders:true,
legacyHeaders:false,




});


const profileLimiter=rateLimit({
windowMs: 60 * 1000,        // 1 minute
  max: 10,                    // 10 profile lookups per minute per IP
  message: { error: 'Too many profile requests, slow down' },

})

const roastLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute  
  max: 3,                     // 3 roasts per minute per IP
  message: { error: 'Too many roast requests, wait a moment' },
});

module.exports={apiLimiter,profileLimiter,roastLimiter};
