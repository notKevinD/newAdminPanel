// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminLogin, generateToken } from '@/lib/auth';
import { LoginCredentials, LoginResponse, ApiError } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json() as LoginCredentials;
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      const response: ApiError = {
        error: 'Email dan password harus diisi'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: ApiError = {
        error: 'Format email tidak valid'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validasi kredensial
    const { success, userId } = await validateAdminLogin(email, password);

    if (!success || !userId) {
      const response: ApiError = {
        error: 'Email atau password salah'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Generate token
    const token = generateToken(userId, email);

    // Set cookie dengan security options
    const response = NextResponse.json<LoginResponse>(
      { success: true, message: 'Login berhasil' },
      { status: 200 }
    );

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 jam
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiError = {
      error: 'Terjadi kesalahan server'
    };
    return NextResponse.json(response, { status: 500 });
  }
}