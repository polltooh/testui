// Simple in-memory user store
// In production, replace this with a database (PostgreSQL, MongoDB, etc.)

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  firstName?: string;
  lastName?: string;
  zipcode?: string;
  gender?: string;
  date_of_birth?: string;
  language?: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

// Simple password hashing (for demo only - use bcrypt in production)
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use: import bcrypt from 'bcryptjs'; return bcrypt.hashSync(password, 10);
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

export function verifyPassword(password: string, hash: string): boolean {
  // In production, use: return bcrypt.compareSync(password, hash);
  return hashPassword(password) === hash;
}

export function createUser(email: string, password: string, name: string, extra: Partial<User> = {}): User {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user: User = {
    id,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    name,
    createdAt: new Date(),
    ...extra
  };
  users.set(email.toLowerCase(), user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.get(email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }
  return undefined;
}

// Initialize a default demo user
export function initializeDefaultUser() {
  const defaultEmail = 'demo@alphadx.com';
  if (!findUserByEmail(defaultEmail)) {
    createUser(defaultEmail, 'demo123', 'John Doe', {
      firstName: 'John',
      lastName: 'Doe',
      zipcode: '90210',
      gender: 'male',
      date_of_birth: '1990-01-01',
      language: 'en'
    });
  }
}

