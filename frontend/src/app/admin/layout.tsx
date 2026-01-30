'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaChartLine, FaCalendarCheck, FaConciergeBell, FaUsers, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';

const adminNavItems = [
  { href: '/admin', label: 'Tableau de Bord', icon: FaChartLine },
  { href: '/admin/bookings', label: 'Réservations', icon: FaCalendarCheck },
  { href: '/admin/services', label: 'Services', icon: FaConciergeBell },
  { href: '/admin/users', label: 'Utilisateurs', icon: FaUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-40">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <Link href="/admin" className="flex items-center">
            <span className="text-2xl font-bold text-primary-400">Clean</span>
            <span className="text-2xl font-bold text-white">PRO</span>
            <span className="ml-2 text-xs bg-primary-600 px-2 py-1 rounded">Admin</span>
          </Link>
        </div>

        <nav className="mt-6">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white border-r-4 border-primary-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors mb-2"
          >
            <FaArrowLeft className="mr-3" />
            Retour au site
          </Link>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-700">Administration</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Connecté en tant que:</span>
            <span className="text-sm font-medium text-gray-900">{user.name}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
