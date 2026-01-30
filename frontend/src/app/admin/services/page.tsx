'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { servicesAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const categoryLabels: { [key: string]: string } = {
  maison: 'Maison',
  bureau: 'Bureau',
  batiment: 'Bâtiment',
  vehicule: 'Véhicule',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'maison',
    price: '',
    duration: '',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAllAdmin();
      setServices(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
      };

      if (editingService) {
        await servicesAPI.update(editingService._id, data);
        toast.success('Service mis à jour');
      } else {
        await servicesAPI.create(data);
        toast.success('Service créé');
      }
      
      setShowForm(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        category: 'maison',
        price: '',
        duration: '',
        isActive: true,
      });
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration.toString(),
      isActive: service.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      await servicesAPI.delete(id);
      toast.success('Service supprimé');
      fetchServices();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (service: any) => {
    try {
      await servicesAPI.update(service._id, { isActive: !service.isActive });
      toast.success(service.isActive ? 'Service désactivé' : 'Service activé');
      fetchServices();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({
                name: '',
                description: '',
                category: 'maison',
                price: '',
                duration: '',
                isActive: true,
              });
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Ajouter un service
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingService ? 'Modifier le service' : 'Nouveau service'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="maison">Maison</option>
                    <option value="bureau">Bureau</option>
                    <option value="batiment">Bâtiment</option>
                    <option value="vehicule">Véhicule</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DT)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durée (heures)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Service actif</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingService ? 'Mettre à jour' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Nom</th>
                <th className="text-left py-3 px-4 text-gray-600">Catégorie</th>
                <th className="text-left py-3 px-4 text-gray-600">Prix</th>
                <th className="text-left py-3 px-4 text-gray-600">Durée</th>
                <th className="text-left py-3 px-4 text-gray-600">Statut</th>
                <th className="text-left py-3 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{service.description}</p>
                  </td>
                  <td className="py-3 px-4">{categoryLabels[service.category]}</td>
                  <td className="py-3 px-4 font-medium">{service.price} DT</td>
                  <td className="py-3 px-4">{service.duration}h</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {service.isActive ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                      {service.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
