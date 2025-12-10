# DSE Blog API

A comprehensive REST API for a multi-user blog platform built with Node.js, Express, and MySQL. This API supports JWT authentication and role-based access control (admin, author, reader).

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Three roles with different permissions:
  - **Admin**: Full access to all resources and user management
  - **Author**: Can create and manage their own posts
  - **Reader**: Can view published posts
- **Complete Blog Management**: Posts, categories, and tags
- **RESTful API**: Clean and intuitive API endpoints
- **MySQL Database**: Reliable data persistence with foreign key constraints

## Project Structure

```
dse_blog_api/
├── config/
│   ├── db.js                 # Database connection configuration
│   └── database.sql          # SQL schema and table creation
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── postController.js     # Post CRUD operations
│   ├── userController.js     # User management
│   ├── categories.js         # Category management
│   └── tag.js                # Tag management
├── middleware/
│   └── authMiddleWare.js     # JWT authentication middleware
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   ├── postRoutes.js         # Post endpoints
│   ├── userRoutes.js         # User endpoints
│   ├── categoryRoutes.js     # Category endpoints
│   └── tagRoutes.js          # Tag endpoints
├── server.js                 # Main application entry point
├── package.json              # Project dependencies
└── .gitignore                # Git ignore configuration
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codetraildevs/dse_blog_api.git
   cd dse_blog_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=dse_blog_api
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Create the database**
   ```bash
   mysql -u root -p < config/database.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Database Schema

### Users Table
- `id` (PK, auto-increment)
- `name` (VARCHAR)
- `email` (UNIQUE)
- `password` (hashed)
- `role` (ENUM: admin, author, reader)
- `created_at` (TIMESTAMP)

### Posts Table
- `id` (PK, auto-increment)
- `title` (VARCHAR)
- `slug` (UNIQUE)
- `content` (LONGTEXT)
- `status` (ENUM: draft, published)
- `category_id` (FK → categories.id)
- `tag_id` (FK → tags.id)
- `author_id` (FK → users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Categories Table
- `id` (PK, auto-increment)
- `name` (UNIQUE)
- `created_at` (TIMESTAMP)

### Tags Table
- `id` (PK, auto-increment)
- `name` (UNIQUE)
- `created_at` (TIMESTAMP)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post (Author/Admin)
- `PUT /api/posts/:id` - Update post (Author/Admin)
- `DELETE /api/posts/:id` - Delete post (Author/Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag (Admin)
- `PUT /api/tags/:id` - Update tag (Admin)
- `DELETE /api/tags/:id` - Delete tag (Admin)

## Usage Example

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "author"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post (Authenticated)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is my first post content",
    "status": "published",
    "category_id": 1,
    "tag_id": 1
  }'
```

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon for development

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MySQL 2
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **CORS**: For cross-origin requests
- **Environment Variables**: dotenv
- **Development**: Nodemon

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- CORS protection
- SQL parameterized queries (prepared statements)
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- **CodeTrail Devs** - Initial work

## Support

For support, email support@codetraildevs.com or open an issue in the repository.
