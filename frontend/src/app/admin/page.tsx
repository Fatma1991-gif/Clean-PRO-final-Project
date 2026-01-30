'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUsers, FaCalendarCheck, FaConciergeBell, FaEuroSign } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingsAPI, usersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingStatsRes, userStatsRes, bookingsRes] = await Promise.all([
        bookingsAPI.getStats(),
        usersAPI.getStats(),
        bookingsAPI.getAllAdmin(),
      ]);
      setStats(bookingStatsRes.data.data);
      setUserStats(userStatsRes.data.data);
      setRecentBookings(bookingsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const statusLabels: { [key: string]: string } = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    'in-progress': 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
  };

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600">Bienvenue dans l'administration Clean PRO</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Réservations</p>
                <p className="text-3xl font-bold">{stats?.totalBookings || 0}</p>
              </div>
              <FaCalendarCheck className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Revenus Confirmés</p>
                <p className="text-3xl font-bold">{stats?.totalRevenue || 0} DT</p>
              </div>
              <FaEuroSign className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Clients</p>
                <p className="text-3xl font-bold">{userStats?.clientCount || 0}</p>
              </div>
              <FaUsers className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">En attente</p>
                <p className="text-3xl font-bold">
                  {stats?.stats?.find((s: any) => s._id === 'pending')?.count || 0}
                </p>
              </div>
              <FaConciergeBell className="text-4xl text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/bookings" className="card hover:border-primary-500 border-2 border-transparent transition-colors">
            <FaCalendarCheck className="text-3xl text-primary-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Gérer les Réservations</h3>
            <p className="text-gray-600">Voir et modifier les réservations</p>
          </Link>

          <Link href="/admin/services" className="card hover:border-primary-500 border-2 border-transparent transition-colors">
            <FaConciergeBell className="text-3xl text-primary-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Gérer les Services</h3>
            <p className="text-gray-600">Ajouter ou modifier des services</p>
          </Link>

          <Link href="/admin/users" className="card hover:border-primary-500 border-2 border-transparent transition-colors">
            <FaUsers className="text-3xl text-primary-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Gérer les Utilisateurs</h3>
            <p className="text-gray-600">Voir les utilisateurs inscrits</p>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Réservations Récentes</h2>
            <Link href="/admin/bookings" className="text-primary-600 hover:text-primary-700">
              Voir tout →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune réservation</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600">Client</th>
                    <th className="text-left py-3 px-4 text-gray-600">Service</th>
                    <th className="text-left py-3 px-4 text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-gray-600">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-600">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{booking.user?.name}</p>
                          <p className="text-sm text-gray-500">{booking.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{booking.service?.name}</td>
                      <td className="py-3 px-4">
                        {new Date(booking.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
                          {statusLabels[booking.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{booking.totalPrice} DT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
