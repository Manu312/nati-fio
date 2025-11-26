'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole } from '@/types';
import type { Availability } from '@/types';
import { availabilityService } from '@/services/availability.service';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2 } from 'lucide-react';
import { CreateAvailabilityModal } from '@/components/admin/CreateAvailabilityModal';
import { EditAvailabilityModal } from '@/components/admin/EditAvailabilityModal';

export default function DisponibilidadPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.ADMIN] });
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const loadAvailabilities = async () => {
    try {
      setIsLoadingData(true);
      const data = await availabilityService.getAll();
      setAvailabilities(data);
    } catch (error) {
      console.error('Error loading availabilities:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta disponibilidad?')) return;

    try {
      await availabilityService.delete(id);
      loadAvailabilities();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar disponibilidad');
    }
  };

  const handleCreateSuccess = () => {
    loadAvailabilities();
  };

  const handleEdit = (availability: Availability) => {
    setSelectedAvailability(availability);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadAvailabilities();
    setSelectedAvailability(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const daysMap: Record<number, string> = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disponibilidad de Profesores</h1>
          <p className="text-gray-600 mt-2">Gestiona los horarios disponibles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Nueva Disponibilidad
        </motion.button>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : availabilities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No hay disponibilidades registradas</p>
          <p className="text-sm text-gray-400 mt-2">Haz clic en "Nueva Disponibilidad" para comenzar</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Profesor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Día
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hora Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hora Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {availabilities.map((availability, index) => (
                <motion.tr
                  key={availability.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {availability.teacher?.firstName} {availability.teacher?.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {daysMap[availability.dayOfWeek as number] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {availability.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {availability.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(availability)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(availability.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateAvailabilityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      
      <EditAvailabilityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAvailability(null);
        }}
        onSuccess={handleEditSuccess}
        availability={selectedAvailability}
      />
    </div>
  );
}
