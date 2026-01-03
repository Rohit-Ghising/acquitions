import express from 'express'
const router = express.Router()
router.post('/sign-up',(req,res)=>{
  res.send("Post/api/auth/signup")

})
router.post('/sign-in',(req,res)=>{
  res.send("Post/api/auth/signup")

})
router.post('/sign-out',(req,res)=>{
  res.send("Post/api/auth/signup")

})
export default router;