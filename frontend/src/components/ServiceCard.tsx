'use client';

import Link from 'next/link';
import { FaClock } from 'react-icons/fa';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  image: string;
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

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col h-full border border-gray-100">
      <div className="relative h-72 rounded-t-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {/* Service Image */}
        <img 
          src={service.image || '/images/services/default-service.jpg'} 
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/services/default-service.jpg';
          }}
        />
        
        {/* Category Badge */}
        <span className={`absolute top-4 right-4 px-5 py-2 rounded-full text-sm font-bold ${categoryColors[service.category]} shadow-lg`}>
          {categoryLabels[service.category]}
        </span>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {service.name}
        </h3>
        
        <p className="text-gray-600 mb-6 line-clamp-3 text-base flex-grow leading-relaxed">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between mb-8 pt-6 border-t border-gray-200">
          <div className="flex items-center text-gray-700 text-base font-bold">
            <FaClock className="mr-2 text-primary-600 text-lg" />
            <span>{service.duration}h</span>
          </div>
          <div className="flex items-center text-primary-600 font-bold text-3xl">
            {service.price} DT
          </div>
        </div>
        
        <Link
          href={`/services/${service._id}`}
          className="btn-primary w-full text-center block py-3 font-bold text-lg"
        >
          Réserver
        </Link>
      </div>
    </div>
  );
}
