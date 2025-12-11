import {db} from '../config/db.js';

//get all posts include author,category and tags details 
export const getAllPosts = (req, res) => {
    const query = `SELECT p.id, p.title, p.content, p.created_at, u.id as author_id, u.name as author_username,
                   c.id as category_id, c.name as category_name, t.id as tag_id, t.name as tag_name 
                   FROM posts p
                   LEFT JOIN users u ON p.author_id = u.id
                   LEFT JOIN categories c ON p.category_id = c.id
                   LEFT JOIN tags t ON p.tag_id = t.id`;   
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        //check if no posts found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(results);
    }); 
};

//get post by id include author,category and tags details
export const getPostById = (req, res) => {
    const postId = req.params.id;
    const query = `SELECT p.id, p.title, p.content, p.created_at, u.id as author_id, u.name as author_username,
                   c.id as category_id, c.name as category_name, t.id as tag_id, t.name as tag_name
                   FROM posts p
                   LEFT JOIN users u ON p.author_id = u.id
                   LEFT JOIN categories c ON p.category_id = c.id
                   LEFT JOIN tags t ON p.tag_id = t.id
                   WHERE p.id = ?`;
    db.query(query, [postId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        //check if no posts found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(results);
    });
};

//create new post and i need auth id to be the loggged in

export const createPost = (req, res) => {
    const { title, slug, content, status, category_id, tag_id } = req.body;
    const author_id = req.user.id; // Get logged-in user ID from auth middleware

    db.query("INSERT INTO posts (title, slug, content, status, category_id, tag_id, author_id)VALUES (?, ?, ?, ?, ?, ?,?)", [title, slug, content, status, category_id, tag_id, author_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        res.status(201).json({ message: 'Post created successfully', postId: results.insertId });
    }); 
};

//update post by id
export const updatePostById = (req, res) => {
    const postId = req.params.id;
    const { title,slug, content,status, category_id,tag_id } = req.body;
    const query = `UPDATE posts SET title = ?, slug = ?, content = ?, status = ?, category_id = ?, tag_id = ?
                   WHERE id = ?`;
    db.query(query, [title,slug, content,status, category_id, tag_id, postId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        res.status(200).json({ message: 'Post updated successfully', post: results });
    });
    
}

//delete post by id
export const deletePostById = (req, res) => {
    const postId = req.params.id;
    const query = `DELETE FROM posts WHERE id = ?`;
    db.query(query, [postId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }   
        res.status(200).json({ message: 'Post deleted successfully', post: results });
    });
};

//get posts by author id
export const getPostsByAuthorId = (req, res) => {
    const authorId = req.params.authorId;   
    const query = `SELECT p.id, p.title, p.content, p.created_at, u.id as author_id, u.name as author_username,
                   c.id as category_id, c.name as category_name, t.id as tag_id, t.name as tag_name
                     FROM posts p   
                   LEFT JOIN users u ON p.author_id = u.id
                   LEFT JOIN categories c ON p.category_id = c.id
                   LEFT JOIN tags t ON p.tag_id = t.id
                   WHERE p.author_id = ?`;
    db.query(query, [authorId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        //check if no posts found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No posts found for this author' });
        }
        res.status(200).json(results);
    });
};

//get posts by category id
export const getPostsByCategoryId = (req, res) => {
    const categoryId = req.params.categoryId;
    const query = `SELECT p.id, p.title, p.content, p.created_at, u.id as author_id, u.name as author_username,
                   c.id as category_id, c.name as category_name, t.id as tag_id, t.name as tag_name
                     FROM posts p
                   LEFT JOIN users u ON p.author_id = u.id
                   LEFT JOIN categories c ON p.category_id = c.id
                   LEFT JOIN tags t ON p.tag_id = t.id
                   WHERE p.category_id = ?`;
    db.query(query, [categoryId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        //check if no posts found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No posts found for this category' });
        }
        res.status(200).json(results);
    });
};


//get published posts
export const getPublishedPosts = (req, res) => {
    const query = `SELECT p.id, p.title, p.content, p.created_at, u.id as author_id, u.name as author_username, 

                     c.id as category_id, c.name as category_name, t.id as tag_id, t.name as tag_name
                        FROM posts p    
                        LEFT JOIN users u ON p.author_id = u.id
                        LEFT JOIN categories c ON p.category_id = c.id
                        LEFT JOIN tags t ON p.tag_id = t.id
                        WHERE p.status = 'published'`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }   
        //check if no posts found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No published posts found' });
        }       
        res.status(200).json(results);
    });
};
