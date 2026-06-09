// lib/auth.ts
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload, ValidationResult, AdminCredentials, User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const SALT_ROUNDS = 10;

// Contoh data admin (bisa diganti dengan database)
const ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'admin@example.com',
  password_hash: '$2b$10$y5DHaU55D60EhuNUp6HjrOiTNI5uHMxDEeyDxEUQQdP6zueKwDyAC', // Hash dari 'admin123'
};

// Interface untuk extended JWT payload
interface ExtendedJWTPayload extends JwtPayload {
  userId: number;
  email: string;
  role: string;
}

// Fungsi untuk hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Fungsi untuk verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Fungsi untuk generate token
export function generateToken(userId: number, email: string): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
    email,
    role: 'admin'
  };
  
  const options: SignOptions = {
    expiresIn: '24h'
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
}

// Fungsi untuk verify token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ExtendedJWTPayload;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Fungsi untuk validasi login
export async function validateAdminLogin(
  email: string, 
  password: string
): Promise<ValidationResult> {
  try {
    // Ganti dengan query database
    if (email === ADMIN_CREDENTIALS.email) {
      const isValid = await verifyPassword(password, ADMIN_CREDENTIALS.password_hash);
      if (isValid) {
        return { success: true, userId: 1 };
      }
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Login validation error:', error);
    return { success: false, error: 'Validation failed' };
  }
}

// Interface untuk user database
interface DatabaseUser {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

// Fungsi untuk mendapatkan user by email (untuk implementasi database)
export async function getUserByEmail(email: string): Promise<DatabaseUser | null> {
  // Implementasi database query
  // Contoh dengan Prisma:
  // return await prisma.user.findUnique({ 
  //   where: { email },
  //   select: {
  //     id: true,
  //     email: true,
  //     password_hash: true,
  //     role: true,
  //     created_at: true,
  //     updated_at: true
  //   }
  // });
  
  // Temporary return untuk menghindari unused variable warning
  console.log(`Searching for user with email: ${email}`);
  return null;
}

// Interface untuk user yang baru dibuat
interface NewUser {
  id: number;
  email: string;
  role: string;
  created_at: Date;
}

// Fungsi untuk create user (jika diperlukan)
export async function createUser(email: string, password: string): Promise<NewUser | null> {
  try {
    const hashedPassword = await hashPassword(password);
    
    // Implementasi database insert
    // Contoh dengan Prisma:
    // const newUser = await prisma.user.create({
    //   data: { 
    //     email, 
    //     password_hash: hashedPassword, 
    //     role: 'admin' 
    //   }
    // });
    
    // Simulated response - ganti dengan implementasi database sebenarnya
    const newUser: NewUser = {
      id: Date.now(), // Temporary ID generation
      email,
      role: 'admin',
      created_at: new Date()
    };
    
    console.log(`User created with hashed password: ${hashedPassword.substring(0, 20)}...`);
    
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    return null;
  }
}

// Optional: Fungsi untuk update user
export async function updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    
    // Implementasi database update
    // Contoh dengan Prisma:
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { password_hash: hashedPassword, updated_at: new Date() }
    // });
    
    console.log(`Password updated for user ${userId} with hash: ${hashedPassword.substring(0, 20)}...`);
    return true;
  } catch (error) {
    console.error('Failed to update password:', error);
    return false;
  }
}

// Optional: Fungsi untuk delete user
export async function deleteUser(userId: number): Promise<boolean> {
  try {
    // Implementasi database delete
    // Contoh dengan Prisma:
    // await prisma.user.delete({ where: { id: userId } });
    
    console.log(`User ${userId} deleted`);
    return true;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return false;
  }
}