'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'client' as 'client' | 'admin' | 'personnel',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        role: formData.role,
      });
      toast.success('Inscription réussie !');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
          <p className="text-gray-600 mt-2">
            Créez votre compte Clean PRO
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Nom complet
              </label>
              <input
                type="text"
                required
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                Téléphone
              </label>
              <input
                type="tel"
                required
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Adresse (optionnel)
              </label>
              <input
                type="text"
                placeholder="123 Rue Exemple, 75001 Paris"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de compte
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${formData.role === 'client' ? 'border-primary-600 text-primary-700 bg-primary-50 shadow-lg' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={() => setFormData({ ...formData, role: 'client' })}
                    className="hidden"
                  />
                  <div className="font-semibold">Client</div>
                </label>
                <label className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${formData.role === 'personnel' ? 'border-primary-600 text-primary-700 bg-primary-50 shadow-lg' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="personnel"
                    checked={formData.role === 'personnel'}
                    onChange={() => setFormData({ ...formData, role: 'personnel' })}
                    className="hidden"
                  />
                  <div className="font-semibold">Personnel</div>
                </label>
                <label className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${formData.role === 'admin' ? 'border-primary-600 text-primary-700 bg-primary-50 shadow-lg' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={() => setFormData({ ...formData, role: 'admin' })}
                    className="hidden"
                  />
                  <div className="font-semibold">Admin</div>
                </label>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Client :</strong> Réservez des services de nettoyage
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Personnel :</strong> Gérez vos affectations de nettoyage
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Admin :</strong> Accédez au panneau d'administration complet
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2" />
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2" />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              <FaUserPlus className="mr-2" />
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
