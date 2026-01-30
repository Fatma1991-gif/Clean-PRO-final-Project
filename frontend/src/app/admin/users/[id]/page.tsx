'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { usersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = ['maison', 'bureau', 'batiment', 'vehicule'];
const PROFICIENCY_LEVELS = ['débutant', 'intermédiaire', 'expert'];
const DAYS_OF_WEEK = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function AgentDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await usersAPI.getOne(id);
            setUser(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement');
            router.push('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = () => {
        setUser({
            ...user,
            skills: [...(user.skills || []), { category: 'maison', proficiency: 'intermédiaire' }]
        });
    };

    const handleRemoveSkill = (index: number) => {
        const newSkills = user.skills.filter((_: any, i: number) => i !== index);
        setUser({ ...user, skills: newSkills });
    };

    const handleSkillChange = (index: number, field: string, value: string) => {
        const newSkills = [...user.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setUser({ ...user, skills: newSkills });
    };

    const handleAvailabilityChange = (field: string, value: any) => {
        setUser({
            ...user,
            availability: {
                ...user.availability,
                [field]: value,
                lastUpdated: new Date()
            }
        });
    };

    const handleToggleDay = (day: string) => {
        const days = user.availability.availableDays || [];
        const newDays = days.includes(day)
            ? days.filter((d: string) => d !== day)
            : [...days, day];
        handleAvailabilityChange('availableDays', newDays);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await usersAPI.update(id, {
                skills: user.skills,
                availability: user.availability
            });
            toast.success('Agent mis à jour avec succès');
            router.push('/admin/users');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!user) return <div>Agent non trouvé</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-primary-600 hover:text-primary-700 mr-4"
                >
                    <FaArrowLeft className="mr-2" /> Retour
                </button>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            </div>

            {/* Info basique */}
            <div className="card mb-6">
                <h2 className="text-xl font-bold mb-4">Informations de base</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Téléphone</label>
                        <p className="text-gray-900">{user.phone}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600">Adresse</label>
                        <p className="text-gray-900">{user.address || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Compétences */}
            <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Compétences</h2>
                    <button
                        onClick={handleAddSkill}
                        className="btn-secondary text-sm py-1 px-3"
                    >
                        + Ajouter une compétence
                    </button>
                </div>

                {user.skills && user.skills.length > 0 ? (
                    <div className="space-y-3">
                        {user.skills.map((skill: any, idx: number) => (
                            <div key={idx} className="flex items-end gap-3 p-3 bg-gray-50 rounded">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-600">Domaine</label>
                                    <select
                                        value={skill.category || 'maison'}
                                        onChange={(e) => handleSkillChange(idx, 'category', e.target.value)}
                                        className="input w-full mt-1"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-600">Niveau</label>
                                    <select
                                        value={skill.proficiency || 'intermédiaire'}
                                        onChange={(e) => handleSkillChange(idx, 'proficiency', e.target.value)}
                                        className="input w-full mt-1"
                                    >
                                        {PROFICIENCY_LEVELS.map(level => (
                                            <option key={level} value={level}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => handleRemoveSkill(idx)}
                                    className="text-red-600 hover:text-red-700 p-2"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Aucune compétence ajoutée</p>
                )}
            </div>

            {/* Disponibilité */}
            <div className="card mb-6">
                <h2 className="text-xl font-bold mb-4">Disponibilité</h2>

                {/* Statut */}
                <div className="mb-6 p-3 bg-gray-50 rounded">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={user.availability?.isAvailable || false}
                            onChange={(e) => handleAvailabilityChange('isAvailable', e.target.checked)}
                            className="mr-2"
                        />
                        <span className="font-medium">Agent disponible</span>
                    </label>
                </div>

                {/* Horaires */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Heure de début</label>
                        <input
                            type="time"
                            value={user.availability?.startTime || '08:00'}
                            onChange={(e) => handleAvailabilityChange('startTime', e.target.value)}
                            className="input w-full mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Heure de fin</label>
                        <input
                            type="time"
                            value={user.availability?.endTime || '18:00'}
                            onChange={(e) => handleAvailabilityChange('endTime', e.target.value)}
                            className="input w-full mt-1"
                        />
                    </div>
                </div>

                {/* Jours de travail */}
                <div>
                    <label className="text-sm font-medium text-gray-600 block mb-3">Jours disponibles</label>
                    <div className="grid grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map(day => (
                            <label key={day} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={(user.availability?.availableDays || []).includes(day)}
                                    onChange={() => handleToggleDay(day)}
                                    className="mr-2"
                                />
                                <span className="capitalize text-sm">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <button
                    onClick={() => router.back()}
                    className="btn-secondary px-6"
                >
                    Annuler
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-6 flex items-center justify-center"
                >
                    <FaSave className="mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    );
}
