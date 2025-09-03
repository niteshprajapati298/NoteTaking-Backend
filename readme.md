# Note Taking API

A secure, full-featured note-taking API built with TypeScript, Express.js, and MongoDB. Features email-based authentication with OTP verification and complete CRUD operations for notes.

## Features

- 🔐 **Secure Authentication** - Email-based OTP verification system
- 📝 **Note Management** - Create, read, and delete notes
- 🍪 **Cookie-based Sessions** - Secure JWT token management
- 📧 **Email Integration** - OTP delivery via email
- 🔒 **Protected Routes** - Middleware-based authentication
- 📱 **CORS Support** - Ready for frontend integration
- ⚡ **TypeScript** - Full type safety and modern development experience

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with email OTP
- **Email Service**: Nodemailer
- **Validation**: Zod schemas
- **Security**: HTTP-only cookies, CORS protection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Email account for SMTP (Gmail recommended)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-taking-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/NoteTaking
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   COOKIE_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   GOOGLE_CLIENT_ID=your-google-client-id
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/auth`)

#### Check if User Exists
```http
POST /auth/check-user
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Send Login OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Send Signup OTP
```http
POST /auth/send-signup-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "dateOfBirth": "1990-01-01"
}
```

#### Verify Login OTP
```http
POST /auth/verify-login-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

#### Verify Signup OTP
```http
POST /auth/verify-signup-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

#### Get Current User
```http
GET /auth/me
Cookie: token=jwt-token-here
```

#### Logout
```http
POST /auth/logout
Cookie: token=jwt-token-here
```

### Notes Routes (`/notes`)

All note routes require authentication (valid JWT cookie).

#### Get All Notes
```http
GET /notes
Cookie: token=jwt-token-here
```

#### Create Note
```http
POST /notes/createNote
Content-Type: application/json
Cookie: token=jwt-token-here

{
  "title": "My Note Title",
  "content": "Note content here..."
}
```

#### Delete Note
```http
DELETE /notes/:id
Cookie: token=jwt-token-here
```

## Authentication Flow

### New User Signup
1. **Check User**: Call `/auth/check-user` to verify if email exists
2. **Send OTP**: Call `/auth/send-signup-otp` with user details
3. **Verify OTP**: Call `/auth/verify-signup-otp` with the received OTP
4. **Success**: User is created and JWT cookie is set

### Existing User Login
1. **Check User**: Call `/auth/check-user` to verify if email exists
2. **Send OTP**: Call `/auth/send-otp` for login
3. **Verify OTP**: Call `/auth/verify-login-otp` with the received OTP
4. **Success**: JWT cookie is set for the session

## Security Features

- **HTTP-Only Cookies**: JWT tokens stored securely in HTTP-only cookies
- **CORS Protection**: Configured for specific origin with credentials
- **OTP Expiration**: OTPs expire after 5 minutes
- **JWT Expiration**: Tokens expire after 7 days
- **Protected Routes**: Middleware authentication for sensitive endpoints
- **Input Validation**: Zod schemas validate all incoming data

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here",
  "needsSignup": true  
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `EMAIL_PASS`

## Development

### Project Structure
```
src/
├── config/
│   └── db.ts          # Database connection
├── middleware/
│   └── auth.ts        # Authentication middleware
├── models/
│   ├── User.ts        # User model
│   ├── Note.ts        # Note model
│   └── Otp.ts         # OTP model
├── routes/
│   ├── auth.ts        # Authentication routes
│   └── note.ts        # Note management routes
├── utils/
│   └── mailer.ts      # Email configuration
├── validators/
│   ├── auth.ts        # Auth validation schemas
│   └── note.ts        # Note validation schemas
└── index.ts           # Application entry point
```

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 7d) |
| `COOKIE_SECURE` | Enable secure cookies | No (default: false) |
| `EMAIL_USER` | SMTP email address | Yes |
| `EMAIL_PASS` | SMTP email password | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `CLIENT_ORIGIN` | Frontend URL for CORS | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Support

For support, email niteshkmrprajapati298@gmail.com or create an issue in the repository.