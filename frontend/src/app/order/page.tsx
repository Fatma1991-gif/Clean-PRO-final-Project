'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaClock, FaEuroSign, FaTrash, FaCalendar, FaMapMarkerAlt, FaPlus, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { servicesAPI, bookingsAPI, paymentsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  image: string;
}

interface CartItem {
  service: Service;
  quantity: number;
}

const categoryLabels: { [key: string]: string } = {
  maison: 'Maison',
  bureau: 'Bureau',
  batiment: 'Bâtiment',
  vehicule: 'Véhicule',
};

const categoryColors: { [key: string]: string } = {
  maison: 'bg-blue-100 text-blue-800',
  bureau: 'bg-purple-100 text-purple-800',
  batiment: 'bg-orange-100 text-orange-800',
  vehicule: 'bg-green-100 text-green-800',
};

export default function OrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderData, setOrderData] = useState({
    date: '',
    time: '',
    address: '',
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'online',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchServices();
  }, [user, router]);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service: Service) => {
    const existingItem = cart.find(item => item.service._id === service._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.service._id === service._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { service, quantity: 1 }]);
    }
    toast.success(`${service.name} ajouté au panier`);
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter(item => item.service._id !== serviceId));
    toast.success('Service retiré du panier');
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
    } else {
      setCart(cart.map(item =>
        item.service._id === serviceId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.service.price * item.quantity), 0);
  };

  const calculateDuration = () => {
    return cart.reduce((total, item) => total + (item.service.duration * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Veuillez ajouter au moins un service');
      return;
    }

    if (!orderData.date || !orderData.time || !orderData.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      // Create bookings for each item in cart
      const bookingPromises = cart.map(item =>
        bookingsAPI.create({
          serviceId: item.service._id,
          date: orderData.date,
          time: orderData.time,
          address: orderData.address,
          notes: orderData.notes,
          paymentMethod: orderData.paymentMethod,
        } as any)
      );

      const bookingResponses = await Promise.all(bookingPromises);
      
      if (orderData.paymentMethod === 'online') {
        // Pour paiement en ligne, rediriger vers page de paiement
        toast.success('Commande créée. Veuillez procéder au paiement.');
        // Rediriger vers la première réservation pour le paiement
        const firstBookingId = bookingResponses[0].data.data._id;
        router.push(`/payment/${firstBookingId}`);
      } else {
        // Pour paiement en espèces
        toast.success('Commande créée avec succès !');
        setCart([]);
        setOrderData({ date: '', time: '', address: '', notes: '', paymentMethod: 'cash' });
        router.push('/booking');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="py-8 md:py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">Commander Vos Services</h1>
          <p className="text-base md:text-xl text-gray-600">
            Sélectionnez les services que vous souhaitez réserver
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Services Disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {services.map((service) => (
                  <div key={service._id} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-400">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${categoryColors[service.category]}`}>
                          {categoryLabels[service.category]}
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-blue-600 ml-3">{service.price} DT</span>
                    </div>

                    <p className="text-gray-700 text-sm md:text-base mb-4 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-sm md:text-base text-gray-600 mb-4 md:mb-6 bg-gray-100 p-2 md:p-3 rounded-lg">
                      <span className="flex items-center font-semibold">
                        <FaClock className="mr-2 text-primary-600" />
                        {service.duration}h
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(service)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-lg shadow-md hover:shadow-lg"
                    >
                      <FaPlus size={16} />
                      Ajouter au panier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart and Order Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Panier</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 md:py-12 text-base md:text-lg">Aucun service sélectionné</p>
              ) : (
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.service._id} className="bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                      <div className="flex gap-3 p-3">
                        {/* Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={item.service.image || '/images/services/default-service.jpg'} 
                            alt={item.service.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/services/default-service.jpg';
                            }}
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{item.service.name}</p>
                          <p className="text-sm font-semibold text-blue-600">{item.service.price} DT</p>
                          <p className="text-xs text-gray-500">{item.service.duration}h</p>
                        </div>
                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.service._id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Supprimer"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 px-3 pb-3">
                        <button
                          onClick={() => updateQuantity(item.service._id, item.quantity - 1)}
                          className="bg-gray-300 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-400 font-bold text-sm"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.service._id, parseInt(e.target.value) || 1)}
                          className="flex-1 text-center border-2 border-gray-300 rounded-lg py-1 font-bold text-sm"
                        />
                        <button
                          onClick={() => updateQuantity(item.service._id, item.quantity + 1)}
                          className="bg-gray-300 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-400 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Durée totale:</span>
                    <span className="font-bold text-lg">{calculateDuration()}h</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Nombre de services:</span>
                    <span className="font-bold text-lg">{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-blue-700 pt-4 border-t-2 border-blue-300">
                    <span>Total:</span>
                    <span>{calculateTotal()} DT</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Form */}
            {cart.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Détails de la commande</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendar className="inline mr-2" />
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      required
                      value={orderData.date}
                      onChange={(e) => setOrderData({ ...orderData, date: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure souhaitée *
                    </label>
                    <select
                      required
                      value={orderData.time}
                      onChange={(e) => setOrderData({ ...orderData, time: e.target.value })}
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
                      Adresse d'intervention *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123 Rue Exemple, 75001 Paris"
                      value={orderData.address}
                      onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes supplémentaires
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Instructions particulières..."
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Méthode de paiement *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors" style={{borderColor: orderData.paymentMethod === 'cash' ? '#2563eb' : undefined}}>
                        <input
                          type="radio"
                          value="cash"
                          checked={orderData.paymentMethod === 'cash'}
                          onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value as 'cash' | 'online' })}
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
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors" style={{borderColor: orderData.paymentMethod === 'online' ? '#2563eb' : undefined}}>
                        <input
                          type="radio"
                          value="online"
                          checked={orderData.paymentMethod === 'online'}
                          onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value as 'cash' | 'online' })}
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

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Création en cours...' : 'Confirmer la commande'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
