'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { availabilityService } from '@/services/availability.service';
import { useAuth } from '@/hooks';
import { TimeSelect } from '@/components/ui';
import type { CreateAvailabilityDto, DayOfWeek } from '@/types';

interface ProfesorAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacherId: string;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

export function ProfesorAvailabilityModal({
  isOpen,
  onClose,
  onSuccess,
  teacherId,
}: ProfesorAvailabilityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateAvailabilityDto>({
    teacherId,
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        teacherId,
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
      });
      setError('');
    }
  }, [isOpen, teacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.startTime >= formData.endTime) {
      setError('La hora de fin debe ser mayor que la hora de inicio');
      return;
    }

    try {
      setIsLoading(true);
      await availabilityService.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear disponibilidad');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-md w-full"
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Agregar Horario</h2>
                <p className="text-sm text-gray-500">Define tu disponibilidad</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Día de la semana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día de la semana *
              </label>
              <select
                required
                value={formData.dayOfWeek}
                onChange={(e) =>
                  setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) as DayOfWeek })
                }
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-4">
              <TimeSelect
                label="Hora Inicio *"
                required
                value={formData.startTime}
                onChange={(value) => setFormData({ ...formData, startTime: value })}
              />

              <TimeSelect
                label="Hora Fin *"
                required
                value={formData.endTime}
                onChange={(value) => setFormData({ ...formData, endTime: value })}
                minTime={formData.startTime}
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
