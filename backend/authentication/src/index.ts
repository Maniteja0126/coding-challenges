import express from 'express';
import UserRouter from './Routes/User';
import { connectToMongoDB } from './db/config';


const app = express();

app.use(express.json());
const PORT = 3000;

app.use('/auth',UserRouter);
app.listen(PORT , ()=>{
    connectToMongoDB()
    console.log(`Server is running on port ${PORT}`);
})


