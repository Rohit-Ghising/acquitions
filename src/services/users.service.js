import logger from "../config/logger.js"
import { users } from "../models/user.model.js"
import { db } from "../config/database.js"
import { eq } from "drizzle-orm"

export const getAllUsers = async () => {
  try {
    return await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users)
  } catch (error) {
    logger.error("Error getting users:", error)
    throw error
  }
}

export const getUserById = async (id) => {
  try {
    const result = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users).where(eq(users.id, id)).limit(1)
    
    if (result.length === 0) {
      throw new Error("User not found")
    }
    
    return result[0]
  } catch (error) {
    logger.error(`Error getting user by ID ${id}:`, error)
    throw error
  }
}

export const updateUser = async (id, updates) => {
  try {
    // First check if user exists
    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1)
    
    if (existingUser.length === 0) {
      throw new Error("User not found")
    }
    
    // Add updated_at timestamp
    const updateData = {
      ...updates,
      updated_at: new Date()
    }
    
    const result = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
      })
    
    logger.info(`User ${id} updated successfully`)
    return result[0]
  } catch (error) {
    logger.error(`Error updating user ${id}:`, error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    // First check if user exists
    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1)
    
    if (existingUser.length === 0) {
      throw new Error("User not found")
    }
    
    await db.delete(users).where(eq(users.id, id))
    
    logger.info(`User ${id} deleted successfully`)
    return { message: "User deleted successfully" }
  } catch (error) {
    logger.error(`Error deleting user ${id}:`, error)
    throw error
  }
}
