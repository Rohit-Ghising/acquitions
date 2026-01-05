import logger from "../config/logger.js"
import { jwttoken } from "../utils/jwt.js"
import { cookies } from "../utils/cookies.js"

export const authenticateUser = async (req, res, next) => {
  try {
    const token = cookies.get(req, "token")
    
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Access token is required"
      })
    }
    
    const decoded = jwttoken.verify(token)
    req.user = decoded
    next()
  } catch (error) {
    logger.error("Authentication error:", error)
    return res.status(401).json({
      error: "Unauthorized", 
      message: "Invalid or expired token"
    })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required"
    })
  }
  next()
}

export default authenticateUser