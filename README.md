# Luxury Perfumes - E-commerce Application

A full-stack e-commerce application for selling luxury perfumes with an admin panel for product management.

## Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: View all products with filtering and search
- **Shopping Cart**: Add/remove items and manage quantities
- **Order Management**: Place orders and view order history
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of sales, users, and products
- **Product Management**: Add, edit, and delete products
- **User Management**: View and manage user accounts
- **Order Management**: Track and update order statuses
- **Image Upload**: Support for multiple product images

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd perfume-selling-app
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/perfume_app
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
PORT=5000
NODE_ENV=development
```

### 5. Create uploads directory
```bash
mkdir uploads
```

### 6. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB Compass, connect to `mongodb://localhost:27017`

## Running the Application

### Development Mode

1. **Start the backend server** (from root directory):
```bash
npm run dev
```

2. **Start the frontend** (from root directory):
```bash
npm run client
```

Or from the client directory:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

1. **Build the frontend**:
```bash
npm run build
```

2. **Start the production server**:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get bestseller products
- `GET /api/products/search` - Search products

### Admin (Protected)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders

### Orders (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders/me` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

## Database Models

### User
- Basic info (name, email, password)
- Role-based access (user/admin)
- Address and contact information

### Product
- Product details (name, description, price)
- Images (multiple)
- Category, brand, volume
- Stock management
- Ratings and reviews

### Order
- Order items and quantities
- Shipping information
- Payment details
- Order status tracking

## Admin Setup

To create an admin user:

1. Register a regular user account
2. Connect to MongoDB and update the user's role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## File Structure

```
perfume-selling-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── routing/       # Route protection
│   │   └── App.js         # Main app component
│   └── package.json
├── models/                 # Database models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── uploads/                # File uploads
├── server.js              # Express server
├── package.json
└── README.md
```

## Features in Detail

### Product Management
- **Image Upload**: Support for multiple product images
- **Inventory Tracking**: Real-time stock management
- **Pricing**: Support for old/new pricing with discount calculation
- **Categories**: Organized product classification

### Shopping Experience
- **Advanced Filtering**: By category, brand, price range
- **Search Functionality**: Product name, description, and brand search
- **Responsive Grid**: Adaptive product display
- **Quick Actions**: Add to cart, view details

### Security Features
- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcrypt encryption
- **Route Protection**: Admin and user route guards
- **Input Validation**: Server-side validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Email notifications
- Advanced analytics dashboard
- Multi-language support
- Wishlist functionality
- Product reviews and ratings
- Social media integration
- Advanced search with filters
- Bulk product import/export
- SEO optimization
