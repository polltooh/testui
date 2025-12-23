# Backend Authentication API

This is a simple authentication backend for the AlphaDX application.

## API Endpoints

### POST `/api/auth/login`
Authenticates a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "session_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid email or password"
}
```

### GET `/api/auth/me`
Checks the current authentication status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST `/api/auth/logout`
Logs out the current user and invalidates the session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

## Default Demo User

For testing, a default user is automatically created:
- **Email:** `demo@alphadx.com`
- **Password:** `demo123`

## Architecture

- **User Storage:** In-memory Map (replace with database in production)
- **Session Storage:** In-memory Map with 24-hour expiration
- **Password Hashing:** Simple hash function (use bcrypt in production)

## Production Considerations

1. Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. Use proper password hashing (bcrypt, argon2)
3. Use JWT tokens instead of simple session tokens
4. Add rate limiting
5. Add CSRF protection
6. Use HTTPS only
7. Add proper error logging
8. Implement password reset functionality
9. Add email verification
10. Use Redis for session storage in distributed systems

