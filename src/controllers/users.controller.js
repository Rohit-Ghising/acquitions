import logger from "../config/logger.js"
import { getAllUsers, getUserById, updateUser, deleteUser } from "../services/users.service.js"
import { userIdSchema, updateUserSchema } from "../validations/users.validation.js"
import { formatValadationError } from "../utils/format.js"

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info("Getting Users")
    const allUsers = await getAllUsers()
    res.json({
      message: "Successfully retrieved users",
      users: allUsers,
      count: allUsers.length
    })
  } catch (error) {
    logger.error("Error fetching all users:", error)
    next(error)
  }
}

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params)
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValadationError(validationResult.error)
      })
    }

    const { id } = validationResult.data
    logger.info(`Getting user by ID: ${id}`)
    
    const user = await getUserById(id)
    res.json({
      message: "Successfully retrieved user",
      user: user
    })
  } catch (error) {
    logger.error(`Error fetching user by ID:`, error)
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found"
      })
    }
    next(error)
  }
}

export const updateUserById = async (req, res, next) => {
  try {
    const paramsValidation = userIdSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValadationError(paramsValidation.error)
      })
    }

    const bodyValidation = updateUserSchema.safeParse(req.body)
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValadationError(bodyValidation.error)
      })
    }

    const { id } = paramsValidation.data
    const updates = bodyValidation.data
    const userId = req.user.id
    const userRole = req.user.role

    // Check if user is trying to update their own profile or if they're an admin
    if (userId !== id && userRole !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only update your own profile"
      })
    }

    // Only admins can change roles
    if (updates.role && userRole !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only admins can change user roles"
      })
    }

    logger.info(`Updating user ID: ${id}`)    
    const updatedUser = await updateUser(id, updates)
    
    res.json({
      message: "User updated successfully",
      user: updatedUser
    })
  } catch (error) {
    logger.error(`Error updating user:`, error)
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found"
      })
    }
    next(error)
  }
}

export const deleteUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params)
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValadationError(validationResult.error)
      })
    }

    const { id } = validationResult.data
    const userId = req.user.id
    const userRole = req.user.role

    // Check if user is trying to delete their own profile or if they're an admin
    if (userId !== id && userRole !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own profile"
      })
    }

    logger.info(`Deleting user ID: ${id}`)
    const result = await deleteUser(id)
    
    res.json({
      message: "User deleted successfully"
    })
  } catch (error) {
    logger.error(`Error deleting user:`, error)
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found"
      })
    }
    next(error)
  }
}
