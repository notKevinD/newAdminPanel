// hooks/useAdminData.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { JWTPayload } from '@/types';

export function useAdminData() {
  const [adminData, setAdminData] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false); // Track jika sudah fetch

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin data');
      }
      
      const data = await response.json();
      setAdminData(data.user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Hanya fetch jika belum pernah fetch
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAdminData();
    }
  }, [fetchAdminData]);

  return { adminData, loading, error, refetch: fetchAdminData };
}