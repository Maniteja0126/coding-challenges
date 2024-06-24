const express = require('express');
const generateOtp = require('./Routes/auth.route');

const app = express();
app.use(express.json());

app.use('/',generateOtp);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})