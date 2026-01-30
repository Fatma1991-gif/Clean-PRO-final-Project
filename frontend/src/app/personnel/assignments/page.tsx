'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookingsAPI } from '@/lib/api';
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

export default function PersonnelAssignmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'personnel') {
      router.replace('/');
      return;
    }
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const res = await bookingsAPI.getAssignedToMe();
      setBookings(res.data.data || []);
    } catch (e) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner />;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Affectations</h1>
          <p className="text-gray-600 mt-1">Réservations qui vous sont assignées</p>
        </div>

        {bookings.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Aucune affectation pour le moment.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600">Client</th>
                  <th className="text-left py-3 px-4 text-gray-600">Service</th>
                  <th className="text-left py-3 px-4 text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600">Heure</th>
                  <th className="text-left py-3 px-4 text-gray-600">Adresse</th>
                  <th className="text-left py-3 px-4 text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{b.user?.name}</p>
                        <p className="text-sm text-gray-500">{b.user?.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{b.service?.name}</td>
                    <td className="py-3 px-4">{new Date(b.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">{b.time}</td>
                    <td className="py-3 px-4">{b.address}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </td>
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
