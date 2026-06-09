'use client';

import { useRouter } from 'next/navigation';
import { useAdminData } from '@/hooks/useAdminData';

interface StatCard {
  title: string;
  value: number;
  color: string;
  bgColor: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  
  const stats: StatCard[] = [
    { title: 'Total Pengunjung', value: 12453, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Pengguna Aktif', value: 342, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Total Postingan', value: 89, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {adminData && (
                <span className="text-sm text-gray-600">
                  {adminData.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Selamat Datang, {adminData?.email || 'Admin'}!
              </h2>
              <p className="text-gray-600 mb-6">
                Ini adalah halaman admin yang dilindungi. Anda berhasil login!
              </p>
              
              {/* Statistik Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`${stat.bgColor} p-6 rounded-lg transition-transform hover:scale-105`}
                  >
                    <h3 className="font-semibold mb-2 text-gray-800">
                      {stat.title}
                    </h3>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      +12% dari bulan lalu
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Activity Section */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Aktivitas Terbaru
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Login dari device baru
                      </span>
                      <span className="text-xs text-gray-400">
                        2 jam yang lalu
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Mengubah pengaturan sistem
                      </span>
                      <span className="text-xs text-gray-400">
                        1 hari yang lalu
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Menambahkan konten baru
                      </span>
                      <span className="text-xs text-gray-400">
                        3 hari yang lalu
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}