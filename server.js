import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from  './config/db.js';
import auth from './routes/authRoutes.js';
import users from './routes/userRoutes.js';

import categories from './routes/categoryRoutes.js';
import tags from './routes/tagRoutes.js';
import posts from './routes/postRoutes.js';


const app =express();
dotenv.config();//load env variables

app.use(cors());
app.use(express.json());//to parse json data

//check database connection
db.connect((err)=>{
    if(err){
        console.log('Database connection failed:', err);
    }
    else{
        console.log('Database connected successfully');
    }
});

 //Auth routes
app.use('/api/auth',auth);

//admin only manage users
app.use('/api/users',users);
//categories routes
app.use('/api/categories',categories);
//tags routes
app.use('/api/tags',tags);

//posts routes
app.use('/api/posts',posts);

 //listen to server

 app.listen(process.env.PORT||5000,()=>{
    console.log(`Server is running on port ${process.env.PORT||5000}`);
 });