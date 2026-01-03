import jwt from "jsonwebtoken"
import logger from "../config/logger"
const JWT_SECRET = process.env.JWT_SECRET || "please chane your secret key"
const JWT_EXPIRES_IN = "1d"
export const jwttoken={
  sign:(payload)=>{
    try {
      return jwt.sign(payload,JWT_SECRET,{expiresIn: JWT_EXPIRES_IN})
} catch (error) {
      logger.error("FAiled to authuntiaacte token",error)
      throw new Error("Failed to aurhinrticate")
      
    }
  },
  verify: (token)=>{
    try {
      return jwt.verify(token, JWT_SECRET)
      
    } catch (error) {
      logger.error("FAiled to authuntiaacte token",error)
      throw new Error("Failed to aurhinrticate")
      
      
    }
  }
}