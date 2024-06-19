
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserData } from '../Model/model';

import { generateToken } from '../utils/generateToken';

const UserRouter = express.Router();


UserRouter.post('/signup' ,async(req : Request ,res : Response)=>{
    try {

        const {userName , password} = req.body;
        console.log(req.body);

        const existingUser = await UserData.findOne({userName});
        if(existingUser){
            return res.status(409).json({message : "User already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new UserData({userName , password : hashedPassword});

        if(newUser){
            //@ts-ignore
            generateToken(newUser.userName || "", res);
            await newUser.save();
            res.status(201).json({userName})

        } else {
            res.status(400).json({ error: "Invalid User Data" });
          }

    } catch (error) {
        res.status(500).json({ message : error });
        console.log("error " , error);
    }
})


UserRouter.post("/login" ,async (req,res)=>{
    try {
        const {userName , password} = req.body;
        const user = await UserData.findOne({ userName });
        const isPasswordCorrect = await bcrypt.compare(
          password,
          user?.password || ""
        );
        

        if(!user || !isPasswordCorrect){
            return res.status(400).json({message : "Invalid userName or password"});
        }

        generateToken(userName , res);
        res.status(200).json({message : "Login Successful"});

        
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    

})

export default UserRouter;