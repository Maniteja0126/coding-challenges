import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { userSchema } from '../types';
import { User } from '../Model/auth.model';
import { authMiddleware } from '../middleware/authMiddleware';

const authRouter = express.Router();

authRouter.post('/signup' , async(req,res)=>{ 

    try {
        const {userName , password} = req.body;
        const user = userSchema.safeParse({userName , password});
        if(!user.success){
            return res.status(400).json({
                message : "User details invalid"
            })
        } 
        const existingUser = await User.findOne({userName});
        if(existingUser){
            return res.status(409).json({
                message : "Already user exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await User.create({userName , password : hashedPassword});
        await newUser.save();
        res.status(200).json({
            message : "User created successful",
            userName , 
            password : hashedPassword
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'  });
    }
})

authRouter.post('/login' , async(req,res)=>{
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "";
        const {userName , password} = req.body;
        const user = userSchema.safeParse({userName , password});
        if(!user.success){
            return res.status(400).json({
                message : "User details invalid"
            })
        }
        const existingUser = await User.findOne({userName});
        const decodedPassword = await bcrypt.compare(password , existingUser?.password || "");
        if(!existingUser || !decodedPassword){
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }
        const token = jwt.sign({userName , password } , JWT_SECRET)
        res.status(200).json({
            token
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'  });
        
    }
})

authRouter.get('/data',authMiddleware ,async(req,res)=>{
    try {
        const users = await User.find({}, { _id: 1, userName: 1 });
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'  });
        
    }
})


export default authRouter;