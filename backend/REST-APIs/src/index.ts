import express from "express";
import {TodoRouter} from './routes/route'

const app = express();
const PORT = 3000;

app.use(express.json())
app.use('/api', TodoRouter)


app.listen(PORT ,()=>{
   console.log("Server is running on port 3000");
})
