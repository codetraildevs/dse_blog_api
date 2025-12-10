import {db } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();//load env variables
//login by checking user role
export const loginUser=(req,res)=>{
    const {email,password}=req.body;

    //check if user exist

    db.query("SELECT * FROM users where email=?",[email],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get user :${err}`});
        if(results.length===0) return res.status(404).json({message:`user not found`}); 

        //compare password
        bcrypt.compare(password,results[0].password,(err,match)=>{
            if(!match) return res.status(403).json({message:`incorrect password`}); 
        });
        //create token
        const token =jwt.sign({id:results[0].id,name:results[0].name,role:results[0].role},process.env.JWT_SECRET_KEY,{expiresIn:'7D'});
        return res.status(200).json({messgage:"Login successful",token:token,role:results[0].role});
    });
}

//Admin register author and reader

export const registerUser=(req,res)=>{
    const {name,email,password,role}=req.body;
    //check if user already exist
    db.query("SELECT * FROM users where email=?",[email],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get user :${err}`});
        if(results.length>0) return res.status(409).json({message:`user already exist`});
        //hash password
       const hash = bcrypt.hashSync(password,10);
         //insert user into database
            db.query("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",[name,email,hash,role],(err,results)=>{
                if(err) return res.status(500).json({error:`failed to register user :${err}`});
                return res.status(201).json({message:`user registered successfully`});
            });
    });
}