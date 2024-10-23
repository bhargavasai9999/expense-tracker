import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDatabase from './config/database.js'
import {transactionRouter} from './routes/transactions.js'
import {userRouter} from './routes/users.js'

dotenv.config()
const PORT=process.env.PORT || 5000

const app=express()

await connectDatabase()

app.use(cors())
app.use(express.json())

app.use("/api/users",userRouter)
app.use("/api",transactionRouter)


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})