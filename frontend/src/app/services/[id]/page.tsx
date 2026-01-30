'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaClock, FaEuroSign, FaCalendar, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { servicesAPI, bookingsAPI, paymentsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const categoryLabels: { [key: string]: string } = {
  maison: 'Maison',
  bureau: 'Bureau',
  batiment: 'Bâtiment',
  vehicule: 'Véhicule',
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    address: '',
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'online',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesAPI.getOne(params.id as string);
        setService(response.data.data);
      } catch (error) {
        console.error('Error fetching service:', error);
        toast.error('Service non trouvé');
        router.push('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        serviceId: params.id as string,
        date: booking.date,
        time: booking.time,
        address: booking.address,
        notes: booking.notes,
        paymentMethod: booking.paymentMethod,
      };

      const bookingResponse = await bookingsAPI.create(bookingData as any);
      const bookingId = bookingResponse.data.data._id;

      if (booking.paymentMethod === 'online') {
        // Créer un paiement Stripe
        const paymentResponse = await paymentsAPI.createPaymentIntent(bookingId);
        // Ici, tu devrais rediriger vers une page de paiement Stripe
        // Pour l'instant, nous affichons un succès
        toast.success('Réservation créée. Veuillez procéder au paiement.');
        router.push(`/payment/${bookingId}`);
      } else {
        toast.success('Réservation effectuée avec succès !');
        router.push('/booking');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return null;
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Service Details */}
          <div>
            <div className="relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mb-6 flex items-center justify-center overflow-hidden group">
              <img 
                src={service.image || '/images/services/default-service.jpg'} 
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/services/default-service.jpg';
                }}
              />
              <span className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                {categoryLabels[service.category]}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{service.name}</h1>
            
            <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">{service.description}</p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="flex items-center">
                <FaClock className="text-primary-600 mr-2 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-semibold">{service.duration} heures</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEuroSign className="text-primary-600 mr-2 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="font-semibold text-2xl text-primary-600">{service.price} DT</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Ce qui est inclus :</h3>
              <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li>✓ Personnel qualifié et expérimenté</li>
                <li>✓ Produits de nettoyage écologiques</li>
                <li>✓ Équipement professionnel</li>
                <li>✓ Garantie satisfaction</li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Réserver ce service</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Date souhaitée
                </label>
                <input
                  type="date"
                  min={minDate}
                  required
                  value={booking.date}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure souhaitée
                </label>
                <select
                  required
                  value={booking.time}
                  onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                  className="input"
                >
                  <option value="">Sélectionnez une heure</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Adresse d'intervention
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Rue Exemple, 75001 Paris"
                  value={booking.address}
                  onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes supplémentaires (optionnel)
                </label>
                <textarea
                  rows={3}
                  placeholder="Instructions particulières, code d'accès, etc."
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Méthode de paiement *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors" style={{borderColor: booking.paymentMethod === 'cash' ? '#2563eb' : undefined}}>
                    <input
                      type="radio"
                      value="cash"
                      checked={booking.paymentMethod === 'cash'}
                      onChange={(e) => setBooking({ ...booking, paymentMethod: e.target.value as 'cash' | 'online' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 flex items-center">
                      <FaMoneyBillWave className="text-green-600 mr-2" />
                      <div>
                        <p className="font-semibold text-gray-900">Paiement en espèces</p>
                        <p className="text-sm text-gray-600">Payez après la prestation</p>
                      </div>
                    </span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors" style={{borderColor: booking.paymentMethod === 'online' ? '#2563eb' : undefined}}>
                    <input
                      type="radio"
                      value="online"
                      checked={booking.paymentMethod === 'online'}
                      onChange={(e) => setBooking({ ...booking, paymentMethod: e.target.value as 'cash' | 'online' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 flex items-center">
                      <FaCreditCard className="text-blue-600 mr-2" />
                      <div>
                        <p className="font-semibold text-gray-900">Paiement en ligne</p>
                        <p className="text-sm text-gray-600">Carte bancaire sécurisée</p>
                      </div>
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-700">Total à payer</span>
                  <span className="text-3xl font-bold text-primary-600">{service.price} DT</span>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
