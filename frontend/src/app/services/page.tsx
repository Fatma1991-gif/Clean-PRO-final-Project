'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHome, FaBuilding, FaBriefcase, FaCar } from 'react-icons/fa';
import ServiceCard from '@/components/ServiceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { servicesAPI } from '@/lib/api';

const categories = [
  { id: '', name: 'Tous', icon: null },
  { id: 'maison', name: 'Maisons', icon: FaHome },
  { id: 'batiment', name: 'Bâtiments', icon: FaBuilding },
  { id: 'bureau', name: 'Bureaux', icon: FaBriefcase },
  { id: 'vehicule', name: 'Véhicules', icon: FaCar },
];

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await servicesAPI.getAll(selectedCategory || undefined);
        setServices(response.data.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  return (
    <div className="py-8 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">Nos Services</h1>
          <p className="text-base md:text-xl text-gray-600">
            Découvrez notre gamme complète de services de nettoyage professionnels
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {category.icon && <category.icon className="mr-2" />}
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun service trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
              {services.map((service: any) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
