# Apex Meridian - Investment Management Platform

## Overview
Apex Meridian is a web-based investment and trading management platform built with Node.js, Express, and MongoDB. It provides a comprehensive system for users to manage their investments, trades, wallets, deposits, withdrawals, and KYC verification. The platform includes both user-facing and admin-facing interfaces with robust authentication and session management.

## Features

### User Features
- User registration, login, and OTP-based authentication
- KYC submission and verification
- Deposit and withdrawal management
- Wallet management for multiple cryptocurrencies or payment methods
- Trade management including open trades, trade history, and analytics
- Transaction history overview
- User settings including profile updates and password changes
- Dashboard displaying key metrics such as total deposits, withdrawals, profits, and losses

### Admin Features
- Admin registration and login
- Admin dashboard with overview of users, wallets, deposits, and withdrawals
- User management including viewing user details, trades, and transactions
- KYC approval and rejection
- Blocking and unblocking users
- Wallet management including uploading wallet QR codes
- Deposit and withdrawal approval and deletion
- Trade manipulation and balance editing
- Live user search functionality

## Technology Stack
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: Session-based with express-session, bcrypt for password hashing
- File Uploads: Multer with Cloudinary integration for storage
- Templating Engine: EJS
- Email: Nodemailer for sending emails (e.g., password reset, OTP)
- Other: dotenv for environment variables, CORS, cookie-parser

## Project Structure
- `index.js`: Main application entry point, sets up Express server, middleware, routes, and database connection
- `routes/`: Contains route definitions for user (`basicroute.js`) and admin (`adminroute.js`)
- `controllers/`: Business logic for handling requests and responses
- `models/`: Mongoose schemas for users, trades, wallets, deposits, withdrawals, KYC, and admin data
- `middlewares/`: Authentication, file upload handling, and other middleware functions
- `views/`: EJS templates for user and admin interfaces, including partials for headers and footers
- `public/`: Static assets such as CSS, JavaScript, images, and uploaded files
- `config/`: Configuration files for mail and password reset email templates

## Setup and Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with the following variables:
   - `DBURI`: MongoDB connection string
   - `PORT`: Port number for the server (e.g., 3000)
   - `SESSION_SECRET`: Secret key for session management
   - Other environment variables as needed for mail and cloudinary configuration
4. Run `npm start` or `npm run dev` to start the server
5. Access the application at `http://localhost:<PORT>`

## Usage
- Users can sign up, verify their accounts via OTP, submit KYC documents, and manage their investments and trades.
- Admins can log in to the admin panel to manage users, approve KYC, and oversee deposits and withdrawals.

## License
This project is licensed under the ISC License.
