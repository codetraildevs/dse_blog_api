import {db} from '../config/db.js';

//get ALL categories

export const getAllCategories=(req,res)=>{
    db.query("SELECT * FROM categories",(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get categories :${err}`});
        if(results.length===0) return res.status(404).json({message:`no categories found`});
        return res.status(200).json({categories:results});
    }); 
}
//get category by id
export const getCategoryById=(req,res)=>{
    const categoryId =req.params.id;
    db.query("SELECT * FROM categories where id=?",[categoryId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to get category :${err}`});
        if(results.length===0) return res.status(404).json({message:`category not found`}); 
        return res.status(200).json({category:results[0]});
    });
}
//create new category
export const createCategory=(req,res)=>{
    const {name}=req.body;
     //check if category already exists
     db.query("SELECT * FROM categories WHERE name=?", [name], (err, results) => {
        if(err) return res.status(500).json({error:`failed to check category :${err}`});
        if(results.length > 0) return res.status(409).json({message:`category already exists`});
    });

    db.query("INSERT INTO categories (name) VALUES (?)",[name],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to create category :${err}`});
    
        return res.status(201).json({message:`category created successfully`});
    });
}

//update category by id
export const updateCategoryById=(req,res)=>{
    const categoryId =req.params.id;
    const {name}=req.body;
    db.query("UPDATE categories SET name=? WHERE id=?",[name,categoryId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to update category :${err}`});
        if(results.length===0) return res.status(404).json({message:`category not found`});
        return res.status(200).json({message:`category updated successfully`});
    });
}


//delete category by id
export const deleteCategoryById=(req,res)=>{
    const categoryId =req.params.id;
    db.query("DELETE FROM categories WHERE id=?",[categoryId],(err,results)=>{
        if(err) return res.status(500).json({error:`failed to delete category :${err}`});
        if(results.affectedRows===0) return res.status(404).json({message:`category not found`}); 
        return res.status(200).json({message:`category deleted successfully`});
    });
}