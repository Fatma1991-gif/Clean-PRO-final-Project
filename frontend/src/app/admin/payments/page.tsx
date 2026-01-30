'use client';

import { useEffect, useState } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PaymentsAdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'cash' | 'online'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAllAdmin();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    if (method === 'cash') {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800"><FaMoneyBillWave className="mr-2" /> Espèces</span>;
    }
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800"><FaCreditCard className="mr-2" /> En ligne</span>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800"><FaCheckCircle className="mr-2" /> Payé</span>;
      case 'failed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800"><FaTimesCircle className="mr-2" /> Échoué</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800"><FaClock className="mr-2" /> En attente</span>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.paymentMethod === filter;
  });

  const stats = {
    totalAmount: bookings.reduce((sum, b) => sum + (b.paymentStatus === 'completed' ? b.totalPrice : 0), 0),
    completedPayments: bookings.filter(b => b.paymentStatus === 'completed').length,
    pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').length,
    failedPayments: bookings.filter(b => b.paymentStatus === 'failed').length,
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Paiements</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivi des paiements en ligne et en espèces</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 mr-4">
                <FaCreditCard className="text-blue-600 dark:text-blue-300 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Revenu Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAmount} DT</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 mr-4">
                <FaCheckCircle className="text-green-600 dark:text-green-300 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Paiements Complétés</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3 mr-4">
                <FaClock className="text-yellow-600 dark:text-yellow-300 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900 rounded-lg p-3 mr-4">
                <FaTimesCircle className="text-red-600 dark:text-red-300 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Paiements Échoués</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failedPayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('cash')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              filter === 'cash'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <FaMoneyBillWave /> Espèces
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              filter === 'online'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <FaCreditCard /> En ligne
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Méthode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-semibold">{booking.user?.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">{booking.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{booking.service?.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{booking.totalPrice} DT</td>
                    <td className="px-6 py-4 text-sm">{getPaymentMethodBadge(booking.paymentMethod || 'cash')}</td>
                    <td className="px-6 py-4 text-sm">{getPaymentStatusBadge(booking.paymentStatus || 'pending')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-600 dark:text-gray-400">Aucune réservation trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
