import {db} from '../config/db.js';

//get all users
export const getAllUsers=(req,res)=>{
    db.query("SELECT id,name,email,role FROM users",(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get users :${err}`});
        return res.status(200).json({users:results});
    });
}

//get user by id
export const getUserById=(req,res)=>{
    const userId =req.params.id;
    db.query("SELECT id,name,email,role FROM users where id=?",[userId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get user :${err}`});
        if(results.length===0) return res.status(404).json({message:`user not found`}); 
        return res.status(200).json({user:results[0]});
    });
}
//delete user by id
export const deleteUserById=(req,res)=>{
    const userId =req.params.id;
    db.query("DELETE FROM users WHERE id=?",[userId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to delete user :${err}`});
        if(results.affectedRows===0) return res.status(404).json({message:`user not found`}); 
        return res.status(200).json({message:`user deleted successfully`});
    });
}
//update user by id
export const updateUserById=(req,res)=>{
    const userId =req.params.id;    
    const {name,email,role}=req.body;
    db.query("UPDATE users SET name=?,email=?,role=? WHERE id=?",[name,email,role,userId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to update user :${err}`});
        if(results.affectedRows===0) return res.status(404).json({message:`user not found`}); 
        return res.status(200).json({message:`user updated successfully`});
    });
}   


