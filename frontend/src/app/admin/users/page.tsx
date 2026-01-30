'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTrash, FaUser, FaUserShield, FaEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { usersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        try {
            await usersAPI.delete(id);
            toast.success('Utilisateur supprimé');
            fetchUsers();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            await usersAPI.update(id, { role: newRole });
            toast.success('Rôle mis à jour');
            fetchUsers();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // Filtrer les agents (personnel)
    const agents = users.filter((u) => u.role === 'personnel');

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs & Agents</h1>
            </div>

            {/* Section Agents */}
            {agents.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Agents de Nettoyage</h2>
                    <div className="card overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left py-3 px-4 text-gray-600">Agent</th>
                                    <th className="text-left py-3 px-4 text-gray-600">Téléphone</th>
                                    <th className="text-left py-3 px-4 text-gray-600">Compétences</th>
                                    <th className="text-center py-3 px-4 text-gray-600">Disponibilité</th>
                                    <th className="text-center py-3 px-4 text-gray-600">Horaires</th>
                                    <th className="text-left py-3 px-4 text-gray-600">Inscrit le</th>
                                    <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map((u) => (
                                    <tr key={u._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-primary-100">
                                                    <FaUser className="text-primary-600" />
                                                </div>
                                                <div>
                                                    <span className="font-medium block">{u.name}</span>
                                                    <span className="text-xs text-gray-500">{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{u.phone}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {u.skills && u.skills.length > 0 ? (
                                                    u.skills.map((skill: any, idx: number) => (
                                                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-500">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {u.availability?.isAvailable ? (
                                                <FaCheckCircle className="text-green-600 inline-block" title="Disponible" />
                                            ) : (
                                                <FaTimesCircle className="text-red-600 inline-block" title="Indisponible" />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            {u.availability?.startTime && u.availability?.endTime ? (
                                                <span>{u.availability.startTime} - {u.availability.endTime}</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link
                                                href={`/admin/users/${u._id}`}
                                                className="text-primary-600 hover:text-primary-700 p-2 inline-block"
                                                title="Éditer"
                                            >
                                                <FaEdit />
                                            </Link>
                                            {u._id !== user?.id && (
                                                <button
                                                    onClick={() => handleDelete(u._id)}
                                                    className="text-red-600 hover:text-red-700 p-2"
                                                    title="Supprimer"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Section Tous les utilisateurs */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tous les Utilisateurs</h2>
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left py-3 px-4 text-gray-600">Utilisateur</th>
                                <th className="text-left py-3 px-4 text-gray-600">Email</th>
                                <th className="text-left py-3 px-4 text-gray-600">Téléphone</th>
                                <th className="text-left py-3 px-4 text-gray-600">Rôle</th>
                                <th className="text-left py-3 px-4 text-gray-600">Inscrit le</th>
                                <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${u.role === 'admin' ? 'bg-purple-100' : u.role === 'personnel' ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                {u.role === 'admin' ? (
                                                    <FaUserShield className="text-purple-600" />
                                                ) : (
                                                    <FaUser className={u.role === 'personnel' ? 'text-blue-600' : 'text-gray-600'} />
                                                )}
                                            </div>
                                            <span className="font-medium">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">{u.email}</td>
                                    <td className="py-3 px-4">{u.phone}</td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            disabled={u._id === user?.id}
                                            className="input py-1 px-2 text-sm disabled:opacity-50"
                                        >
                                            <option value="client">Client</option>
                                            <option value="personnel">Personnel</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-3 px-4">
                                        {u.role === 'personnel' && (
                                            <Link
                                                href={`/admin/users/${u._id}`}
                                                className="text-primary-600 hover:text-primary-700 p-2 inline-block"
                                                title="Gérer l'agent"
                                            >
                                                <FaEdit />
                                            </Link>
                                        )}
                                        {u._id !== user?.id && (
                                            <button
                                                onClick={() => handleDelete(u._id)}
                                                className="text-red-600 hover:text-red-700 p-2"
                                                title="Supprimer"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
