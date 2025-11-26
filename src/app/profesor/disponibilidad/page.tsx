'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types';
import type { Availability, Teacher } from '@/types';
import { availabilityService } from '@/services/availability.service';
import { teacherService } from '@/services';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

const DAYS_MAP: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export default function ProfesorDisponibilidadPage() {
  const { isLoading: authLoading } = useProtectedRoute({ requiredRoles: [UserRole.PROFESOR] });
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [teacherId, setTeacherId] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadTeacherData();
    }
  }, [user]);

  const loadTeacherData = async () => {
    try {
      setIsLoadingData(true);
      
      // Obtener el profesor asociado al usuario actual
      const teachers = await teacherService.getAll();
      const myTeacher = teachers.find((t: Teacher) => t.userId === user?.id);
      
      if (myTeacher) {
        setTeacherId(myTeacher.id);
        await loadAvailabilities(myTeacher.id);
      }
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadAvailabilities = async (tId: string) => {
    try {
      const allAvailabilities = await availabilityService.getAll();
      // Filtrar solo las del profesor actual
      const myAvailabilities = allAvailabilities.filter((a: Availability) => a.teacherId === tId);
      setAvailabilities(myAvailabilities);
    } catch (error) {
      console.error('Error loading availabilities:', error);
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!teacherId) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            No se encontró un perfil de profesor asociado a tu cuenta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Disponibilidad</h1>
        <p className="text-gray-600 mt-2">Visualiza tus horarios configurados</p>
        
        {/* Mensaje informativo */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Tu disponibilidad es gestionada por un administrador
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Si necesitas modificar tus horarios, contacta con el administrador del sistema
            </p>
          </div>
        </div>
      </div>

      {availabilities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Sin horarios configurados
          </h3>
          <p className="text-gray-600 mb-2">
            Aún no tienes disponibilidad configurada en el sistema
          </p>
          <p className="text-sm text-gray-500">
            Contacta con el administrador para configurar tus horarios disponibles
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availabilities.map((availability, index) => (
            <motion.div
              key={availability.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {DAYS_MAP[availability.dayOfWeek as number]}
                    </h3>
                    <span className="text-xs text-green-600">Activo</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {availability.startTime} - {availability.endTime}
                  </span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
                  Duración: {(() => {
                    const start = availability.startTime.split(':');
                    const end = availability.endTime.split(':');
                    const hours = parseInt(end[0]) - parseInt(start[0]);
                    const minutes = parseInt(end[1]) - parseInt(start[1]);
                    return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
                  })()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Nota al pie */}
      {availabilities.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔒 Solo los administradores pueden modificar la disponibilidad
          </p>
        </div>
      )}
    </div>
  );
}
