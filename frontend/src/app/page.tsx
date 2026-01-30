'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome, FaBuilding, FaBriefcase, FaCar, FaCheck, FaStar } from 'react-icons/fa';
import ServiceCard from '@/components/ServiceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { servicesAPI } from '@/lib/api';

const categories = [
  { id: 'maison', name: 'Maisons', icon: FaHome, color: 'bg-blue-500' },
  { id: 'batiment', name: 'Bâtiments', icon: FaBuilding, color: 'bg-orange-500' },
  { id: 'bureau', name: 'Bureaux', icon: FaBriefcase, color: 'bg-purple-500' },
  { id: 'vehicule', name: 'Véhicules', icon: FaCar, color: 'bg-green-500' },
];

const features = [
  'Personnel qualifié et formé',
  'Produits écologiques',
  'Satisfaction garantie',
  'Tarifs transparents',
  'Réservation en ligne 24/7',
  'Service client réactif',
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll();
        setServices(response.data.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in">
              Services de Nettoyage
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">Professionnels</span>
            </h1>
            <p className="text-base md:text-lg lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto font-medium text-primary-100 leading-relaxed animate-slide-up">
              Confiez le ménage à des experts. Maisons, bureaux, bâtiments et véhicules - nous nous occupons de tout avec excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link href="/services" className="btn-primary px-6 md:px-8 py-3 md:py-4 text-base md:text-lg shadow-xl">
                Découvrir nos services
              </Link>
              <Link href="/register" className="bg-white/20 backdrop-blur-md border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 shadow-lg">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Nos Domaines d&apos;Intervention</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mt-2">Des solutions adaptées à tous vos besoins</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/services?category=${category.id}`} className="group">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md dark:shadow-md dark:shadow-black/30 hover:shadow-xl dark:hover:shadow-lg hover:scale-105 transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                  <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <category.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12 md:py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Services Populaires</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Découvrez nos services les plus demandés</p>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-3xl">
                {services.map((service: any) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary px-8 py-4 text-lg inline-block">
              Voir tous les services →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 dark:from-gray-950 dark:via-primary-950 dark:to-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Pourquoi Choisir Clean PRO ?</h2>
            <p className="text-primary-200 dark:text-primary-300 text-lg mt-2">L&apos;excellence à chaque service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-primary-400/50 transition-all duration-300 hover:bg-white/15">
                <FaCheck className="text-primary-300 mr-4 flex-shrink-0 text-2xl mt-1" />
                <span className="text-white font-medium text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Ce Que Disent Nos Clients</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Satisfaction garantie à 100%</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Marie D.', text: 'Service impeccable ! Ma maison n\'a jamais été aussi propre. Équipe très professionnelle.', rating: 5 },
              { name: 'Pierre L.', text: 'Professionnels, ponctuels et efficaces. Tarifs justes et transparents. Je recommande vivement.', rating: 5 },
              { name: 'Sophie M.', text: 'Excellent rapport qualité-prix pour le nettoyage de nos bureaux. Service fiable et régulier.', rating: 5 },
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-primary-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Prêt à Profiter d&apos;un Espace Impeccable ?
          </h2>
          <p className="text-primary-100 dark:text-primary-200 mb-8 text-lg max-w-2xl mx-auto">
            Réservez votre service de nettoyage en quelques clics. Satisfaction garantie ou remboursé.
          </p>
          <Link href="/services" className="bg-white text-primary-600 dark:text-primary-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 inline-block shadow-xl hover:shadow-2xl hover:scale-105">
            Réserver Maintenant →
          </Link>
        </div>
      </section>
    </div>
  );
}
