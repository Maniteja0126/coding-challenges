const e = require('express');
const express = require('express');
const {createClient} = require('redis');

const app = express();
app.use(express.json());


const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error',(err)=>{
    console.log('Redis Client Error' , err);
})

app.post('/submit' ,async(req,res)=>{
    const {problemId , code , language} = req.body;
    try {
        await client.lPush("problems" , JSON.stringify({code , language , problemId}));
        res.status(200).send("Submission received and stored");
    } catch (error) {
        console.log('Redis error : ' , error);
        res.status(500).send('Failed to store submission');
    }
})

async function startServer(){
    try{
        await client.connect();
        console.log('Connected to Redis');
        app.listen(3000 ,()=>{
            console.log('Server is running on port 3000');
        })
    }catch(error){
        console.log('Error connecting to Redis : ' , error);
    }
}

startServer()