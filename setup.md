# Perfume App Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Setup

Make sure your `config.env` file is properly configured:
```env
MONGODB_URI=mongodb://localhost:27017/perfume_app
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

Ensure MongoDB is running on your system. If using MongoDB Compass, connect to `mongodb://localhost:27017`

### 4. Run the Application

```bash
# Start backend (from root directory)
npm run dev

# Start frontend (from root directory)
npm run client

# Or start frontend separately
cd client
npm start
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin (after login as admin)

## Create Admin User

1. Register a regular user account
2. Connect to MongoDB and update the user's role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Features Implemented

### Backend
- ✅ User authentication (JWT)
- ✅ Product management API
- ✅ Order management API
- ✅ Admin routes protection
- ✅ File upload handling
- ✅ Database models (User, Product, Order)

### Frontend
- ✅ User authentication (Login/Register)
- ✅ Product browsing with filters
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ Admin dashboard
- ✅ Navigation and routing

## Next Steps

1. **Complete Admin Panel**: Implement product CRUD operations
2. **Product Management**: Add image upload and product editing
3. **Order Processing**: Implement checkout and payment
4. **User Features**: Complete profile management and order history
5. **Enhancements**: Add reviews, wishlist, search functionality

## Troubleshooting

- **MongoDB Connection**: Ensure MongoDB is running and accessible
- **Port Conflicts**: Check if ports 3000 and 5000 are available
- **File Uploads**: Ensure the `uploads` directory exists and has write permissions
- **CORS Issues**: Backend is configured to allow requests from frontend

## Development Notes

- The app uses JWT for authentication
- File uploads are stored locally in the `uploads` directory
- Admin routes are protected and require admin role
- Cart data is persisted in localStorage
- Responsive design works on mobile and desktop
