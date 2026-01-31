'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Booking, Teacher, UpdateBookingDto } from '@/types';
import { teacherService } from '@/services/teacher.service';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateBookingDto) => Promise<void>;
  booking: Booking | null;
}

export function EditBookingModal({ isOpen, onClose, onSubmit, booking }: EditBookingModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    teacherId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (booking) {
      // Parsear la fecha correctamente
      const dateStr = booking.date.includes('T') ? booking.date.split('T')[0] : booking.date;
      
      setFormData({
        teacherId: booking.teacherId,
        date: dateStr,
        startTime: booking.startTime.substring(0, 5), // HH:mm
        endTime: booking.endTime.substring(0, 5),
      });
    }
  }, [booking]);

  const loadTeachers = async () => {
    try {
      setIsLoadingTeachers(true);
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      setError('Error al cargar profesores');
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Solo enviar los campos que cambiaron
      const updateData: UpdateBookingDto = {};
      
      if (formData.teacherId !== booking.teacherId) {
        updateData.teacherId = formData.teacherId;
      }
      
      const originalDate = booking.date.includes('T') ? booking.date.split('T')[0] : booking.date;
      if (formData.date !== originalDate) {
        updateData.date = formData.date;
      }
      
      if (formData.startTime !== booking.startTime.substring(0, 5)) {
        updateData.startTime = formData.startTime;
      }
      
      if (formData.endTime !== booking.endTime.substring(0, 5)) {
        updateData.endTime = formData.endTime;
      }

      // Si no hay cambios, cerrar
      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      await onSubmit(booking.id, updateData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la reserva');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Reserva">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Info del alumno (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alumno
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
            {booking.student?.firstName} {booking.student?.lastName}
            {booking.student?.user?.email && (
              <span className="text-gray-500 ml-2">({booking.student.user.email})</span>
            )}
          </div>
        </div>

        {/* Profesor */}
        <div>
          <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
            Profesor *
          </label>
          <select
            id="teacherId"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            disabled={isLoadingTeachers}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Seleccionar profesor...</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
          {formData.teacherId !== booking.teacherId && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Transferir a otro profesor
            </p>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Horario */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Hora Inicio *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Hora Fin *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
