'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { bookingService } from '@/services';
import { RecurringGroup, MonthlyBookingResult } from '@/types';
import { Calendar, RefreshCw, User, GraduationCap, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface RecurringGroupsListProps {
  onUpdate?: () => void;
}

export function RecurringGroupsList({ onUpdate }: RecurringGroupsListProps) {
  const [groups, setGroups] = useState<RecurringGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<RecurringGroup | null>(null);
  const [renewResult, setRenewResult] = useState<MonthlyBookingResult | null>(null);
  const [showRenewResult, setShowRenewResult] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await bookingService.getRecurringGroups();
      setGroups(data);
    } catch (err) {
      setError('Error al cargar grupos recurrentes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewClick = (group: RecurringGroup) => {
    setSelectedGroup(group);
    setShowConfirm(true);
  };

  const handleConfirmRenew = async () => {
    if (!selectedGroup) return;

    try {
      setRenewingId(selectedGroup.id);
      setShowConfirm(false);
      
      const result = await bookingService.renewMonthly(selectedGroup.id);
      
      // Validar que result tenga la estructura esperada
      if (!result || typeof result.totalDates !== 'number') {
        throw new Error('Respuesta del servidor en formato inválido');
      }
      
      setRenewResult(result);
      setShowRenewResult(true);
      
      // Recargar grupos
      await loadGroups();
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al renovar grupo');
    } finally {
      setRenewingId(null);
      setSelectedGroup(null);
    }
  };

  const getNextMonth = (month: number, year: number) => {
    if (month === 12) {
      return { month: 1, year: year + 1 };
    }
    return { month: month + 1, year };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && !showRenewResult) {
    return (
      <Alert variant="error" onClose={() => setError('')}>
        {error}
      </Alert>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay clases recurrentes</h3>
        <p className="text-gray-600">
          Crea un grupo de clases mensuales para que aparezcan aquí
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {showRenewResult && renewResult && (
          <Alert
            variant={renewResult.failed.length === 0 ? 'success' : 'warning'}
            onClose={() => {
              setShowRenewResult(false);
              setRenewResult(null);
            }}
          >
            <div className="space-y-2">
              <p className="font-semibold">
                Renovación completada: {renewResult.successful.length} de{' '}
                {renewResult.totalDates} clases creadas
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 max-h-32 overflow-y-auto">
                {renewResult.successful.map((booking, index) => (
                  <div
                    key={`success-${index}`}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-100 text-green-800"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>
                      {new Date(booking.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                ))}
                {renewResult.failed.map((item, index) => (
                  <div
                    key={`failed-${index}`}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 text-red-800"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>
                      {new Date(item.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Alert>
        )}

        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="grid gap-4">
          {groups.map((group, index) => {
            const nextMonth = getNextMonth(group.month, group.year);
            const isRenewing = renewingId === group.id;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Encabezado */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {DAYS_OF_WEEK[group.dayOfWeek]}s de {MONTHS[group.month - 1]} {group.year}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {group.bookings?.length || 0} clases programadas
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          {group.startTime} - {group.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Información */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Alumno</p>
                          <p className="text-sm font-medium text-gray-900">
                            {group.student?.firstName} {group.student?.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Profesor</p>
                          <p className="text-sm font-medium text-gray-900">
                            {group.teacher?.firstName} {group.teacher?.lastName}
                          </p>
                        </div>
                      </div>

                      {group.subject && (
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Materia</p>
                            <p className="text-sm font-medium text-gray-900">{group.subject.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de renovar */}
                  <div className="lg:pl-4 lg:border-l lg:border-gray-200">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRenewClick(group)}
                      isLoading={isRenewing}
                      disabled={isRenewing}
                      className="w-full lg:w-auto"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renovar para {MONTHS[nextMonth.month - 1]}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center lg:text-left">
                      Crear clases para el próximo mes
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Diálogo de confirmación */}
      {selectedGroup && (
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => {
            setShowConfirm(false);
            setSelectedGroup(null);
          }}
          onConfirm={handleConfirmRenew}
          title="Renovar Clases Mensuales"
          message={`¿Estás seguro de que deseas crear las clases para ${
            MONTHS[getNextMonth(selectedGroup.month, selectedGroup.year).month - 1]
          } ${getNextMonth(selectedGroup.month, selectedGroup.year).year}? Se crearán todas las clases del ${
            DAYS_OF_WEEK[selectedGroup.dayOfWeek]
          } de ese mes.`}
          confirmText="Renovar"
        />
      )}
    </>
  );
}
