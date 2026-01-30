'use client';

import { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingsAPI, usersAPI } from '@/lib/api';
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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [personnels, setPersonnels] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAllAdmin(statusFilter || undefined);
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // charger la liste des personnels pour l'affectation
    (async () => {
      try {
        const res = await usersAPI.getAll('personnel');
        setPersonnels(res.data.data || []);
      } catch (e) {
        // silencieux
      }
    })();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await bookingsAPI.updateStatus(id, newStatus);
      toast.success('Statut mis à jour');
      fetchBookings();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleAssign = async (id: string, personnelId: string) => {
    try {
      await bookingsAPI.assign(id, personnelId);
      toast.success('Personnel affecté');
      fetchBookings();
    } catch (error) {
      toast.error('Erreur lors de l\'affectation');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <FaFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Aucune réservation trouvée</p>
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
                <th className="text-left py-3 px-4 text-gray-600">Prix</th>
                <th className="text-left py-3 px-4 text-gray-600">Assigné à</th>
                <th className="text-left py-3 px-4 text-gray-600">Statut</th>
                <th className="text-left py-3 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{booking.user?.name}</p>
                      <p className="text-sm text-gray-500">{booking.user?.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{booking.service?.name}</td>
                  <td className="py-3 px-4">
                    {new Date(booking.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">{booking.time}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{booking.address}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">{booking.totalPrice} DT</td>
                  <td className="py-3 px-4">
                    <select
                      value={booking.assignedTo?._id || ''}
                      onChange={(e) => handleAssign(booking._id, e.target.value)}
                      className="input py-1 px-2 text-sm min-w-[180px]"
                    >
                      <option value="">Non assigné</option>
                      {personnels.map((p) => (
                        <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
                      {statusLabels[booking.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="input py-1 px-2 text-sm"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
