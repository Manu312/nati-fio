'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole } from '@/types';
import type { Availability, Teacher } from '@/types';
import { availabilityService } from '@/services/availability.service';
import { teacherService } from '@/services/teacher.service';
import { Button } from '@/components/ui/Button';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { CreateAvailabilityModal } from '@/components/admin/CreateAvailabilityModal';
import { EditAvailabilityModal } from '@/components/admin/EditAvailabilityModal';

// Días de la semana ordenados (Lun-Dom)
const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAYS_MAP: Record<number, string> = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
};

interface TeacherAvailability {
  teacher: Teacher;
  availabilities: Availability[];
  byDay: Record<number, Availability[]>;
}

export default function DisponibilidadPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.ADMIN] });
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [preselectedTeacherId, setPreselectedTeacherId] = useState<string | null>(null);
  const [preselectedDay, setPreselectedDay] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [availData, teacherData] = await Promise.all([
        availabilityService.getAll(),
        teacherService.getAll(),
      ]);
      setAvailabilities(availData);
      setTeachers(teacherData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Agrupar disponibilidades por profesor
  const teacherAvailabilities = useMemo<TeacherAvailability[]>(() => {
    const teacherMap = new Map<string, TeacherAvailability>();

    teachers.forEach((teacher) => {
      teacherMap.set(teacher.id, {
        teacher,
        availabilities: [],
        byDay: {},
      });
    });

    availabilities.forEach((avail) => {
      const teacherData = teacherMap.get(avail.teacherId);
      if (teacherData) {
        teacherData.availabilities.push(avail);
        const day = avail.dayOfWeek as number;
        if (!teacherData.byDay[day]) {
          teacherData.byDay[day] = [];
        }
        teacherData.byDay[day].push(avail);
      }
    });

    // Ordenar horarios dentro de cada día
    teacherMap.forEach((data) => {
      Object.keys(data.byDay).forEach((day) => {
        data.byDay[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });
    });

    return Array.from(teacherMap.values()).sort((a, b) =>
      `${a.teacher.firstName} ${a.teacher.lastName}`.localeCompare(
        `${b.teacher.firstName} ${b.teacher.lastName}`
      )
    );
  }, [availabilities, teachers]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;

    try {
      await availabilityService.delete(id);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar disponibilidad');
    }
  };

  const handleCreateSuccess = () => {
    loadData();
    setPreselectedTeacherId(null);
    setPreselectedDay(null);
  };

  const handleOpenCreateModal = (teacherId?: string, day?: number) => {
    setPreselectedTeacherId(teacherId || null);
    setPreselectedDay(day !== undefined ? day : null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setPreselectedTeacherId(null);
    setPreselectedDay(null);
  };

  const handleEdit = (availability: Availability) => {
    setSelectedAvailability(availability);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadData();
    setSelectedAvailability(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disponibilidad de Profesores</h1>
          <p className="text-gray-600 mt-2">Vista por profesor con horarios organizados por día</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenCreateModal()}
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
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No hay profesores registrados</p>
          <p className="text-sm text-gray-400 mt-2">Primero debes crear profesores para gestionar disponibilidad</p>
        </div>
      ) : (
        <div className="space-y-6">
          {teacherAvailabilities.map((ta, index) => (
            <motion.div
              key={ta.teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header del profesor */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {ta.teacher.firstName?.charAt(0)}{ta.teacher.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {ta.teacher.firstName} {ta.teacher.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ta.availabilities.length} horario{ta.availabilities.length !== 1 ? 's' : ''} disponible{ta.availabilities.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid de días */}
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {DAYS_ORDER.map((day) => (
                    <div key={day} className="min-h-[100px]">
                      {/* Header del día */}
                      <div className="text-center mb-2 pb-2 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {DAYS_MAP[day]}
                        </span>
                      </div>

                      {/* Horarios del día */}
                      <div className="space-y-1">
                        {ta.byDay[day]?.length > 0 ? (
                          ta.byDay[day].map((avail) => (
                            <motion.div
                              key={avail.id}
                              whileHover={{ scale: 1.02 }}
                              className="group relative bg-green-50 border border-green-200 rounded-lg p-2 cursor-pointer hover:bg-green-100 transition-colors"
                              onClick={() => handleEdit(avail)}
                            >
                              <div className="flex items-center gap-1 text-xs text-green-700">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">
                                  {avail.startTime.slice(0, 5)}
                                </span>
                              </div>
                              <div className="text-xs text-green-600 ml-4">
                                {avail.endTime.slice(0, 5)}
                              </div>
                              
                              {/* Botón eliminar en hover */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(avail.id);
                                }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))
                        ) : (
                          <button
                            onClick={() => handleOpenCreateModal(ta.teacher.id, day)}
                            className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-xs"
                          >
                            <Plus className="w-3 h-3" />
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateAvailabilityModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        preselectedTeacherId={preselectedTeacherId}
        preselectedDay={preselectedDay}
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
