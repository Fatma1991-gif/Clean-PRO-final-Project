'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaTrash, FaTimes, FaCheckCircle, FaHourglassStart, FaRunning, FaFingerprint } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

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

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(id);
      toast.success('Réservation annulée');
      fetchBookings();
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-2">Mes Réservations</h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Gérez et suivez vos réservations de services de nettoyage
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="mb-6">
              <FaCalendar className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-6">Vous n'avez aucune réservation pour le moment.</p>
            <button
              onClick={() => router.push('/services')}
              className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Découvrir nos services
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {booking.service?.name || 'Service'}
                      </h3>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${statusColors[booking.status]} shadow-md`}>
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                        <FaCalendar className="text-primary-600 dark:text-primary-300 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Date</p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {new Date(booking.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                        <FaClock className="text-primary-600 dark:text-primary-300 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Heure</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{booking.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 md:col-span-2">
                      <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                        <FaMapMarkerAlt className="text-primary-600 dark:text-primary-300 text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Adresse</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{booking.address}</p>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded mb-6">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-semibold">Note :</span> {booking.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400 font-semibold">Prix total :</span>
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {booking.totalPrice} DT
                      </span>
                    </div>
                    
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <FaTimes />
                        Annuler la réservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
