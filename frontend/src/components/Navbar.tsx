'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaShoppingCart, FaBell } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const isPersonnel = user?.role === 'personnel';
  const [notifCount, setNotifCount] = useState<number>(0);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white px-3 py-2 rounded-xl font-bold text-lg">
                Clean
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white ml-2">PRO</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Accueil
            </Link>
            {!isPersonnel && (
              <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Services
              </Link>
            )}
            {isPersonnel && (
              <Link href="/personnel/assignments" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Affectations
              </Link>
            )}
            {user ? (
              <>
                {!isPersonnel && (
                  <Link href="/order" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                    <FaShoppingCart className="mr-1" />
                    Commander
                  </Link>
                )}
                {!isPersonnel && (
                  <Link href="/booking" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                    Mes Réservations
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                    Administration
                  </Link>
                )}
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                  {isPersonnel && (
                    <Link href="/personnel/assignments" className="relative text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      <FaBell size={18} />
                      {notifCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {notifCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                    <FaUser className="mr-2 text-primary-600 dark:text-primary-400" />
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    <FaSignOutAlt className="mr-1" />
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary">
                  Inscription
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 bg-white dark:bg-gray-900">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
                Accueil
              </Link>
              {!isPersonnel && (
                <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
                  Services
                </Link>
              )}
              {isPersonnel && (
                <Link href="/personnel/assignments" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
                  Affectations
                </Link>
              )}
              {user ? (
                <>
                  {!isPersonnel && (
                    <Link href="/order" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold" onClick={() => setIsOpen(false)}>
                      <FaShoppingCart className="mr-1" />
                      Commander
                    </Link>
                  )}
                  {!isPersonnel && (
                    <Link href="/booking" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
                      Mes Réservations
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setIsOpen(false)}>
                    Connexion
                  </Link>
                  <Link href="/register" className="text-primary-600 dark:text-primary-400 font-semibold" onClick={() => setIsOpen(false)}>
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
