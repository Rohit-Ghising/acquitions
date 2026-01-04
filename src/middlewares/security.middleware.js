import { slidingWindow } from "@arcjet/node"
import aj from "../config/arcject.js"
import logger from "../config/logger.js"


export const securityMiddleware = async (req,res,next) =>{
  try {
    const role = req.user?.role || 'guest'
    let limit
    let message
    switch(role){
      case'admin':
      limit=20
      message="Admin request exceeded  20 per minute. Slow down"
      break;
      case'user':
      limit=10
      message="User request exceeded  10 per minute. Slow down"
      break;
      case'guest':
      limit=5
      message="Guest request exceeded  5 per minute. Slow down"
      break;
    }
    const client = aj.withRule(slidingWindow({mode:"LIVE",interval:"1m",max:limit,name:`${role}-rate-limit`}))
    const decision = await client.protect(req)

    if(decision.isDenied() && decision.reason.isBot()){
      logger.warn("Bot request blocked",{ip: req.ip,userAgent:req.get("User-Agent"),path:req.path})
      return res.status(403).json({
        error:"Forbidden",
        message:"Automated request not allowed"
      })
    }

      if(decision.isDenied() && decision.reason.isShield()){
      logger.warn("Shield block request",{ip: req.ip,userAgent:req.get("User-Agent"),path:req.path,method:req.method})
      return res.status(403).json({
        error:"Forbidden",
        message:"Request blocked by security"
      })
    }
     if(decision.isDenied() && decision.reason.isRateLimit()){
      logger.warn("Rate Limit exceeded",{ip: req.ip,userAgent:req.get("User-Agent"),path:req.path,method:req.method})
      return res.status(403).json({
        error:"Forbidden",
        message:"Too many request"
      })
    }
    next()
    
  } catch (error) {
    console.error("Arcjetv Middleware",error)
    res.status(500).json({error:"INternal server error",
      message:"Somethinf went wrong wti security middleare"
    })
    
  }

}
export default securityMiddleware