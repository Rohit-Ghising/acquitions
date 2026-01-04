import express from 'express'

import helmet from "helmet";
import morgan from "morgan"
import cors from "cors"
import cookieParser from 'cookie-parser';
import logger from './config/logger.js';
import authRoutes from './routes/authRoutes.js';
import { securityMiddleware } from './middlewares/security.middleware.js';
const app = express()




app.use(helmet());

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use(securityMiddleware)
app.use(morgan('combined',{stream:{write:(message)=>logger.info(message.trim(message.trim()))}}))
app.get('/api',(req,res)=>{

  res.status(200).send("Hello world fromaqi")
})


app.get('/',(req,res)=>{
  logger.info('HELLO rom logger')
  res.status(200).send("Hello world")
})

export default app