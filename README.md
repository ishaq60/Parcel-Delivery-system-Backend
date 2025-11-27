# Parcel Delivery System - Backend

A robust and scalable backend API for managing parcel deliveries, built with Node.js, Express, and TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Development](#development)
- [Scripts](#scripts)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## ✨ Features

- **User Management**: Register and manage users with role-based access
- **Authentication**: JWT-based authentication and authorization
- **Parcel Management**: Create, track, and manage parcel deliveries
- **Validation**: Request validation using Zod schema validation
- **Error Handling**: Centralized error handling with custom error classes
- **Security**: Password hashing with bcryptjs
- **CORS Support**: Configured for cross-origin requests
- **MongoDB**: Persistent data storage with Mongoose ODM
- **Type Safety**: Full TypeScript support for better code quality

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.1.0)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **CORS**: Cross-origin resource sharing support
- **Development Tools**: 
  - ts-node-dev (for hot reload development)
  - ESLint (for code linting)
  - TypeScript

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (local or cloud instance)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parcel-delivery-system-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create a .env file in the root directory
   cp .env.example .env
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/parcel-delivery

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── config/
│   └── env.ts               # Environment variables
├── constants/
│   └── pagination.ts        # Pagination constants
├── enums/
│   └── user.ts              # User role enums
├── errors/
│   └── ApiError.ts          # Custom error class
├── middleware/
│   ├── auth.ts              # Authentication middleware
│   ├── globalehandaler.ts   # Global error handler
│   ├── notfound.ts          # 404 handler
│   └── validateRequest.ts   # Request validation middleware
├── modules/
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   └── auth.service.ts
│   ├── parcel/              # Parcel management module
│   │   ├── parcel.controller.ts
│   │   ├── parcel.interface.ts
│   │   ├── parcel.model.ts
│   │   ├── parcel.route.ts
│   │   ├── parcel.service.ts
│   │   └── parcel.validation.ts
│   └── user/                # User management module
│       ├── user.controller.ts
│       ├── user.interface.ts
│       ├── user.model.ts
│       ├── user.route.ts
│       ├── user.service.ts
│       └── user.validation.ts
├── router/
│   └── route.ts             # API routes aggregator
├── types/
│   └── express/
│       └── index.d.ts       # Express type definitions
└── utils/
    ├── catchAsync.ts        # Async error wrapper
    ├── jwt.ts               # JWT utilities
    ├── pick.ts              # Object utility
    └── sendResponse.ts      # Response formatter
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Parcels
- `POST /api/parcels` - Create new parcel
- `GET /api/parcels` - Get all parcels
- `GET /api/parcels/:id` - Get parcel by ID
- `PUT /api/parcels/:id` - Update parcel
- `DELETE /api/parcels/:id` - Delete parcel
- `PATCH /api/parcels/:id/status` - Update parcel status

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

This starts the development server with hot reload enabled using `ts-node-dev`.

### Production Build

```bash
# Build the project
npm run build

# Start the server
npm start
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests (currently not configured) |

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Server returns a JWT token
3. Client includes token in Authorization header: `Authorization: Bearer <token>`
4. Server validates token on protected routes

### Protected Routes

Routes requiring authentication are protected by the `auth` middleware. Ensure you include the JWT token in the request headers.

### Example Request with Token
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/parcels
```

## ⚠️ Error Handling

The application implements centralized error handling:

- **ApiError**: Custom error class for API errors
- **Global Error Handler**: Middleware to catch and format all errors
- **Async Wrapper**: `catchAsync` utility to wrap async route handlers

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errorDetails": {},
  "stack": "error stack trace (development only)"
}
```

## 🧪 Testing

To set up testing (if not already done):

```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev supertest @types/supertest
```

Then create test files in a `tests/` directory and configure Jest in `jest.config.js`.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📦 Deployment

### Vercel Deployment

The project includes a `vercel.json` configuration file for easy deployment to Vercel:

```bash
npm install -g vercel
vercel
```

### Environment Variables on Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add your environment variables (MONGODB_URI, JWT_SECRET, etc.)

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

Programming Hero Student Project

## 📞 Support

For issues and questions:
- Open an issue in the repository
- Check existing issues for similar problems
- Provide detailed error messages and steps to reproduce

## 🚀 Future Enhancements

- [ ] Add unit tests and integration tests
- [ ] Implement email notifications
- [ ] Add real-time tracking with WebSockets
- [ ] Implement payment integration
- [ ] Add role-based access control (RBAC)
- [ ] Implement API rate limiting
- [ ] Add logging system

---

**Last Updated**: November 27, 2025  
**Version**: 1.0.0
