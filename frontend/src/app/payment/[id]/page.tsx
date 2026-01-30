'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingsAPI, paymentsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBooking();
  }, [user, router, params.id]);

  const fetchBooking = async () => {
    try {
      const response = await bookingsAPI.getOne(params.id as string);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Réservation non trouvée');
      router.push('/booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Créer l'intention de paiement
      const paymentResponse = await paymentsAPI.createPaymentIntent(params.id as string);
      const { clientSecret } = paymentResponse.data.data;

      // Dans une vraie application, tu utiliserais @stripe/react-stripe-js
      // Pour la démo, nous simulons un paiement réussi
      const fakePaymentIntentId = `pi_${Math.random().toString(36).substr(2, 9)}`;
      
      // Confirmer le paiement
      const confirmResponse = await paymentsAPI.confirmPayment(
        params.id as string,
        fakePaymentIntentId
      );

      if (confirmResponse.data.success) {
        setPaymentStatus('success');
        toast.success('Paiement effectué avec succès !');
        setTimeout(() => {
          router.push('/booking');
        }, 3000);
      } else {
        setPaymentStatus('error');
        toast.error('Le paiement a échoué');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error(error.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {paymentStatus === 'idle' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Paiement Sécurisé</h1>
            <p className="text-gray-600 mb-8">Complétez votre réservation en ligne</p>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold">Service :</span>
                <span className="font-bold text-lg">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold">Date :</span>
                <span>{new Date(booking.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-700 font-semibold">Heure :</span>
                <span>{booking.time}</span>
              </div>
              <div className="border-t-2 border-blue-300 pt-6 flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Total à payer :</span>
                <span className="text-3xl font-bold text-blue-600">{booking.totalPrice} DT</span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
              <p className="text-blue-900 font-medium">
                🔒 Votre paiement est sécurisé par Stripe. Aucune information bancaire ne sera stockée.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Traitement du paiement...' : 'Payer maintenant'}
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Vous serez redirigé vers votre compte après le paiement
            </p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement Réussi !</h1>
            <p className="text-gray-600 mb-4">Votre réservation a été confirmée.</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
              <p className="text-green-900 font-semibold mb-2">Numéro de réservation : {booking._id}</p>
              <p className="text-green-800">Un email de confirmation a été envoyé à votre adresse.</p>
            </div>
            <button
              onClick={() => router.push('/booking')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Voir mes réservations
            </button>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaTimesCircle className="text-6xl text-red-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement Échoué</h1>
            <p className="text-gray-600 mb-8">Veuillez vérifier vos informations et réessayer.</p>
            <div className="flex gap-4">
              <button
                onClick={handlePayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Réessayer
              </button>
              <button
                onClick={() => router.push('/booking')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
