import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();//load env variables

export const db = mysql.createConnection({
    host:process.env.DB_HOST||"127.0.0.1",
    user:process.env.DB_USER||"root",
    password:process.env.DB_PASSWORD||"",
    database:process.env.DB_NAME||"dse_blog_db_api",
    port:process.env.DB_PORT||3306
});
