import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils'
import { Response } from 'express'

export const generateToken = (userName :String , res : Response) =>{
    const token = jwt.sign({userName} , JWT_SECRET ,{
        expiresIn: '15d'
    })

    res.cookie('jwt' , token , {
        maxAge : 15*24*60*60*100 ,
        httpOnly : true ,
        sameSite : "strict",
    })
}