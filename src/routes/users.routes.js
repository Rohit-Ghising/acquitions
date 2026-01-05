import express from 'express'
import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '../controllers/users.controller.js'
import authenticateUser from '../middlewares/auth.middleware.js'
const router = express.Router()

router.get('/', fetchAllUsers)
router.get('/:id', fetchUserById)
router.put('/:id', authenticateUser, updateUserById)
router.delete('/:id', authenticateUser, deleteUserById)
export default router
