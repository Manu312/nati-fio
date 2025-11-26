'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Plus, Trash2 } from 'lucide-react';
import { availabilityService } from '@/services/availability.service';
import { teacherService } from '@/services/teacher.service';
import type { CreateAvailabilityDto, Teacher, DayOfWeek } from '@/types';

interface CreateAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TimeSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
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

export function CreateAvailabilityModal({ isOpen, onClose, onSuccess }: CreateAvailabilityModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: crypto.randomUUID(),
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
      // Reset form
      setSelectedTeacherId('');
      setTimeSlots([
        {
          id: crypto.randomUUID(),
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:00',
        },
      ]);
      setError('');
    }
  }, [isOpen]);

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      setError('Error al cargar profesores');
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        id: crypto.randomUUID(),
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
      },
    ]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    }
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const validateTimeSlots = (): boolean => {
    // Validar cada franja
    for (const slot of timeSlots) {
      if (slot.startTime >= slot.endTime) {
        setError('La hora de fin debe ser mayor que la hora de inicio en todas las franjas');
        return false;
      }
    }

    // Validar que no haya solapamiento entre franjas del mismo día
    const slotsByDay = timeSlots.reduce((acc, slot) => {
      if (!acc[slot.dayOfWeek]) {
        acc[slot.dayOfWeek] = [];
      }
      acc[slot.dayOfWeek].push(slot);
      return acc;
    }, {} as Record<number, TimeSlot[]>);

    for (const [day, slots] of Object.entries(slotsByDay)) {
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const slot1 = slots[i];
          const slot2 = slots[j];
          
          // Verificar solapamiento
          if (
            (slot1.startTime < slot2.endTime && slot1.endTime > slot2.startTime) ||
            (slot2.startTime < slot1.endTime && slot2.endTime > slot1.startTime)
          ) {
            const dayName = DAYS_OF_WEEK.find(d => d.value === parseInt(day))?.label || day;
            setError(`Hay franjas que se solapan el día ${dayName}`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTeacherId) {
      setError('Debes seleccionar un profesor');
      return;
    }

    if (!validateTimeSlots()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Crear todas las franjas
      await Promise.all(
        timeSlots.map((slot) =>
          availabilityService.create({
            teacherId: selectedTeacherId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })
        )
      );
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white text-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10"
            >
          {/* Header */}
          <div className="sticky top-0 bg-white text-gray-900 border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Nueva Disponibilidad</h2>
                <p className="text-sm text-gray-500">Configura un horario para un profesor</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white text-gray-900">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Profesor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesor *
              </label>
              <select
                required
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="">Selecciona un profesor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Franjas Horarias */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Franjas Horarias *
                </label>
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Franja
                </button>
              </div>

              <div className="space-y-3">
                {timeSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Franja #{index + 1}
                      </span>
                      {timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Día de la semana */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Día
                      </label>
                      <select
                        required
                        value={slot.dayOfWeek}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, 'dayOfWeek', parseInt(e.target.value) as DayOfWeek)
                        }
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Horarios */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Inicio
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                          <input
                            type="time"
                            required
                            value={slot.startTime}
                            onChange={(e) =>
                              updateTimeSlot(slot.id, 'startTime', e.target.value)
                            }
                            className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Fin
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                          <input
                            type="time"
                            required
                            value={slot.endTime}
                            onChange={(e) =>
                              updateTimeSlot(slot.id, 'endTime', e.target.value)
                            }
                            className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando...' : `Crear ${timeSlots.length} Franja${timeSlots.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </form>
        </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
