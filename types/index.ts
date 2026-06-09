// types/index.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AdminCredentials {
  email: string;
  password_hash: string;
}

export interface ValidationResult {
  success: boolean;
  userId?: number;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface untuk database user (bisa dipisah ke file terpisah)
export interface DatabaseUser {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface NewUser {
  id: number;
  email: string;
  role: string;
  created_at: Date;
}