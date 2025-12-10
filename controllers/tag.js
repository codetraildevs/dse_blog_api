import {db} from '../config/db.js';

//get all tags
export const getAllTags=(req,res)=>{
    db.query("SELECT * FROM tags",(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get tags :${err}`});
        if(results.length===0) return res.status(404).json({message:`no tags found`});
        return res.status(200).json({tags:results});
    }); 
}
//get tag by id
export const getTagById=(req,res)=>{
    const tagId =req.params.id;
    db.query("SELECT * FROM tags where id=?",[tagId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get tag :${err}`});
        if(results.length===0) return res.status(404).json({message:`tag not found`}); 
        return res.status(200).json({tag:results[0]});
    });
}
//create new tag
export const createTag=(req,res)=>{
    const {name}=req.body;
        //check if tag already exists
        db.query("SELECT * FROM tags WHERE name=?", [name], (err, results) => {
            if(err) return res.status(500).json({error:`failed to check tag :${err}`});
            if(results.length > 0) return res.status(409).json({message:`tag already exists`});
        });

    db.query("INSERT INTO tags (name) VALUES (?)",[name],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to create tag :${err}`});        
        return res.status(201).json({message:`tag created successfully`});
    });
}

//update tag by id
export const updateTagById=(req,res)=>{
    const tagId =req.params.id;
    const {name}=req.body;
    db.query("UPDATE tags SET name=? WHERE id=?",[name,tagId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to update tag :${err}`});
        if(results.length===0) return res.status(404).json({message:`tag not found`});
        return res.status(200).json({message:`tag updated successfully`});
    });
}

//delete tag by id
export const deleteTagById=(req,res)=>{
    const tagId =req.params.id; 
    db.query("DELETE FROM tags WHERE id=?",[tagId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to delete tag :${err}`});
        if(results.affectedRows===0) return res.status(404).json({message:`tag not found`}); 
        return res.status(200).json({message:`tag deleted successfully`});
    });
}