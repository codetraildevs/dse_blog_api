import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();//load env variables
export const verifyToken=(req,res,next)=>{
    const token =req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Access denied. No token provided."});
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
        if(err) return res.status(403).json({message:"Invalid token"});
        req.user=decoded;

        next();
    });
}
//middleware to check admin role only
export const isAdmin=(req,res,next)=>{
    if(req.user.role !=='admin'){
        return res.status(403).json({message:"Access denied. Insufficient permissions."});
    }
    next();
}
//middleware to check author role
export const isAuthor=(req,res,next)=>{
    if(req.user.role !=='author'){
        return res.status(403).json({message:"Access denied. Insufficient permissions."});
    }
    next();
}