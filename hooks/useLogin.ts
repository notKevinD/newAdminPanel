// hooks/useLogin.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials } from '@/types';

interface UseLoginReturn {
  formData: LoginCredentials;
  error: string;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  }, []);

  const resetForm = useCallback((): void => {
    setFormData({ email: '', password: '' });
    setError('');
    setLoading(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi client-side
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      setLoading(false);
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login sukses, redirect ke admin page
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setError('Terjadi kesalahan, silakan coba lagi');
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    resetForm,
  };
}