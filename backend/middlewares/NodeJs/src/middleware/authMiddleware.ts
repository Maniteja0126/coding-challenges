import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
export const authMiddleware = (req : Request , res : Response , next : NextFunction) =>{
    const token = req.headers["authorization"] || "";

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }


    jwt.verify(token , JWT_SECRET , (err , decoded)=>{
        if(err){
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    })
}