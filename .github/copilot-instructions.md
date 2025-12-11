# DSE Blog API - AI Coding Instructions

## Project Overview
**DSE Blog API** is a multi-user blog platform REST API built with Node.js, Express, and MySQL. It uses JWT authentication with three role-based access levels (admin, author, reader) to manage users, posts, categories, and tags.

**Key Dependencies**: Express 5.2, MySQL2, JWT, bcrypt, CORS  
**Dev Workflow**: `npm run dev` (nodemon auto-reload), `npm install`

---

## Architecture & Data Flow

### Layer Structure (MVC Pattern)
```
routes/ → controllers/ → config/db.js → MySQL
         ↓
      middleware/ (JWT auth, role checks)
```

**Routes** (define endpoints + middleware):
- `authRoutes.js` - Login/register (public)
- `postRoutes.js` - CRUD posts with author/category/tag joins
- `userRoutes.js` - Admin-only user management
- `categoryRoutes.js` & `tagRoutes.js` - Master data (public read, admin write)

**Controllers** (business logic, DB queries):
- Each file exports named functions matching HTTP handlers
- All use callback-style `db.query(sql, [params], (err, results) => {})`
- Return JSON responses with status codes + messages

**Database**:
- Single connection instance in `config/db.js` (imported as `{db}`)
- Environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

### Critical Data Relationships
- **Posts** join with **users** (author), **categories**, **tags** via LEFT JOIN
- **Users** table has role column (ENUM: admin, author, reader)
- No foreign key constraints enforced in current schema—ensure data integrity in controllers

---

## Authentication & Authorization

### JWT Pattern
- Token created in `authController.js`: `jwt.sign({id, name, role}, JWT_SECRET_KEY, {expiresIn: '7D'})`
- Token extracted via middleware: `req.headers.authorization?.split(" ")[1]`
- Decoded payload attached as `req.user` (has `id`, `name`, `role`)

### Middleware Composition
```javascript
// Routes apply in this order:
router.post('/', verifyToken, isAdmin||isAuthor, createPost);
// ↓ verifyToken checks token exists & valid, extracts req.user
// ↓ isAdmin||isAuthor checks role (NOTE: This chain may not work as intended—both are checked)
```

⚠️ **Known Issue**: `isAdmin||isAuthor` in routes doesn't short-circuit correctly. Should use role-based guard per endpoint or combine logic.

---

## Code Patterns & Conventions

### Response Format (Consistent)
```javascript
// Success
res.status(200|201).json({ message: "...", [data]: value })

// Error (DB failures)
res.status(500).json({ error: `failed to get user :${err}` })

// Not Found / Validation
res.status(404|409).json({ message: "..." })
```

**Observation**: Uses both `message` and `error` keys inconsistently. When adding endpoints, prefer `message` for errors to maintain consistency.

### Database Query Pattern (Callbacks)
```javascript
db.query(SQL_STRING, [params], (err, results) => {
    if (err) return res.status(500).json({ error: `...${err}` });
    if (results.length === 0) return res.status(404).json({ message: "..." });
    res.status(200).json(results); // or wrap in key: {key: results}
});
```
- Always use parameterized queries (`?` placeholders) to prevent SQL injection
- Check `results.length === 0` for SELECT, `results.affectedRows === 0` for UPDATE/DELETE
- Return early on error; avoid nested callbacks

### Controller Export Style
```javascript
export const functionName = (req, res) => { /* handler */ }
// Named exports, imported individually in routes
```

### Route Definition Pattern
```javascript
import express from 'express';
import { handler1, handler2 } from '../controllers/...js';
import { verifyToken, isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();
router.get('/', handler1);                    // public
router.post('/', verifyToken, handler2);      // private, any authenticated user
router.delete('/:id', verifyToken, isAdmin, handler3);  // admin only

export default router;
```

---

## Common Implementation Patterns

### Adding a New CRUD Endpoint

1. **Controller** (`controllers/newResource.js`):
```javascript
import {db} from '../config/db.js';

export const getAll = (req, res) => {
    db.query("SELECT * FROM resource", (err, results) => {
        if (err) return res.status(500).json({error: `failed: ${err}`});
        if (results.length === 0) return res.status(404).json({message: "no resources"});
        res.status(200).json(results);
    });
};

export const create = (req, res) => {
    const { field1, field2 } = req.body;
    // Duplicate check if needed
    db.query("INSERT INTO resource (field1, field2) VALUES (?, ?)", 
             [field1, field2], (err, results) => {
        if (err) return res.status(500).json({error: `failed: ${err}`});
        res.status(201).json({message: "created", id: results.insertId});
    });
};
```

2. **Routes** (`routes/newResourceRoutes.js`):
```javascript
import express from 'express';
import { getAll, create } from '../controllers/newResource.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();
router.get('/', getAll);  // public
router.post('/', verifyToken, isAdmin, create);  // admin only

export default router;
```

3. **Register in `server.js`**:
```javascript
import newResource from './routes/newResourceRoutes.js';
app.use('/api/newresource', newResource);
```

### Posts with Relationships
`getPostById` exemplifies the JOIN pattern for multi-table data:
```javascript
const query = `SELECT p.*, u.name as author_username, c.name as category_name, t.name as tag_name
               FROM posts p
               LEFT JOIN users u ON p.author_id = u.id
               LEFT JOIN categories c ON p.category_id = c.id
               LEFT JOIN tags t ON p.tag_id = t.id
               WHERE p.id = ?`;
```
**Use LEFT JOIN** to include posts even if author/category/tag is NULL.

### Author-Owned Resources
Posts capture author from JWT token:
```javascript
const author_id = req.user.id; // from verifyToken middleware
// Insert using author_id, not from request body
```
**Apply this pattern**: Never trust resource ownership from client; always extract from `req.user`.

---

## Environment & Setup

### .env Variables Required
```
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=<password>
DB_NAME=dse_blog_api
DB_PORT=3306
JWT_SECRET_KEY=<your_secret>
```

### Starting Development
```bash
npm install              # Install dependencies
mysql -u root -p < config/database.sql  # Create DB & tables
npm run dev             # Start with nodemon (watches for changes)
```

---

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| Token missing/invalid | Ensure `Authorization: Bearer <token>` header format in client requests |
| `req.user` is undefined | Verify `verifyToken` middleware is applied before handlers that need auth |
| Database connection errors | Check `.env` DB credentials; ensure MySQL service is running |
| Duplicate category/tag errors | Check controller logic—ensure SELECT before INSERT validation |
| CORS errors from frontend | Verify `app.use(cors())` is early in `server.js` middleware stack |
| Role-based access not working | Remember `isAdmin\|\|isAuthor` syntax issue—may need refactoring for multi-role checks |

---

## Files to Reference When Extending

- **Adding auth features**: `controllers/authController.js`, `middleware/authMiddleWare.js`
- **Adding CRUD endpoints**: `controllers/postController.js` (complex joins), `controllers/categories.js` (simple resource)
- **Database schema**: `config/database.sql`
- **Route patterns**: `routes/postRoutes.js` (middleware composition)
