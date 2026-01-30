import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-2 rounded-xl font-bold text-lg w-fit mb-4">
              Clean
            </div>
            <h3 className="text-xl font-bold mb-4">PRO</h3>
            <p className="text-gray-400 leading-relaxed">
              Services de nettoyage professionnels pour tous vos besoins résidentiels et commerciaux.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Liens Rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
                  Réserver
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Nos Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="font-medium">🏠 Nettoyage Maisons</li>
              <li className="font-medium">🏢 Nettoyage Bureaux</li>
              <li className="font-medium">🏗️ Nettoyage Bâtiments</li>
              <li className="font-medium">🚗 Nettoyage Véhicules</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center font-medium">
                <FaPhone className="mr-3 text-primary-400 text-lg" />
                <span>+216 24 452 793</span>
              </li>
              <li className="flex items-center font-medium">
                <FaEnvelope className="mr-3 text-primary-400 text-lg" />
                <span>contact@CleanPRO.tn</span>
              </li>
              <li className="flex items-start font-medium">
                <FaMapMarkerAlt className="mr-3 text-primary-400 text-lg mt-1" />
                <span>Tunis, Tataouine</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors bg-gray-800 p-3 rounded-lg hover:bg-primary-600">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors bg-gray-800 p-3 rounded-lg hover:bg-primary-600">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors bg-gray-800 p-3 rounded-lg hover:bg-primary-600">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Clean PRO. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
