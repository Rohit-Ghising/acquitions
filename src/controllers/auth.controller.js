import logger from "../config/logger.js"
import { createUser } from "../services/auth.service.js"
import { cookies } from "../utils/cookies.js"
import { formatValadationError } from "../utils/format.js"
import { jwttoken } from "../utils/jwt.js"
import { signupSchema } from "../validations/auth.valadation.js"

export const signup = async(req,res,next) =>{
  try {
    const validationResult = signupSchema.safeParse(req.body)
    if(!validationResult.success)
    {
      return res.status(400).json({
        error:"VAladation failed",
        details:formatValadationError(validationResult.error)
      })
    }
    const {name ,email,password,role} =validationResult.data
    const user = await createUser({name,email,password,role})
    const token = jwttoken.sign({id:user.id,email:user.email,role:user.role})
    cookies.set(res,"token",token)
    logger.info(`User Registered successfully :${email}`)
    res.status(201).json({
      message:"User registered",
      user:{
        id:user.id,name:user.name,role:user.role,email:user.email
      }
    })
    
  } catch (error) {
    console.log("Signup error",error)
  
  }

}