import express from 'express'
import { connectionToDB } from './db/config';
import authRouter from './Routes/AuthRoute'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json())

app.use('/v1',authRouter)


app.listen(3000 , ()=>{
    connectionToDB();
    console.log("Server is running on port 3000");
})