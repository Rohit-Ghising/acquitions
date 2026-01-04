import { eq } from "drizzle-orm";
import logger from "../config/logger.js"
import bcrypt from "bcrypt"
import { db } from "../config/database.js";
import { users } from "../models/user.model.js";

export const hashPassword = async(password)=>{
  try {
    return await bcrypt.hash(password,10);
    
  } catch (error) {
    logger.error(`Error HAshing Password`)
    throw new Error("Error hashing")
    
  }
}

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    logger.error("Error comparing password")
    throw new Error("Error comparing password")
  }
}

export const createUser = async({name,email,password,role = "user"})=>{
  try {
    const existingUser = await db.select().from(users).where(eq(users.email,email)).limit(1);
    if(( existingUser).length>0) throw new Error("User Alreadu exists")
      const password_hash = await hashPassword(password)
    const [newUser] = await db.insert(users).values({name,email,password:password_hash,role}).returning({id:users.id,name:users
      .name,email:users.email,role:users.role,created_at :users.created_at}
    )
    logger.info(`User ${newUser.email} created Succesfully`)
    return newUser
    
  } 
  catch (error) {
    logger.error("Error cxreating useur")
    throw error
  
  }
}

export const authenticateUser = async (email, password) => {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = existingUser[0]

    if (!user) {
      throw new Error("Invalid email or password")
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      throw new Error("Invalid email or password")
    }

    logger.info(`User ${user.email} authenticated successfully`)

    const { id, name, email: userEmail, role, created_at } = user
    return { id, name, email: userEmail, role, created_at }
  } catch (error) {
    logger.error("Error authenticating user")
    throw error
  }
}
