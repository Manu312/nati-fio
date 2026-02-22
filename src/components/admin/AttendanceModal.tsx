'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Booking, UpdateAttendanceDto } from '@/types';
import { AttendanceStatus } from '@/types';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingId: string, data: UpdateAttendanceDto) => Promise<void>;
  booking: Booking | null;
}

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string; color: string }[] = [
  { value: AttendanceStatus.PRESENT, label: 'Presente', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: AttendanceStatus.ABSENT, label: 'Ausente', color: 'bg-red-100 text-red-800 border-red-300' },
];

export function AttendanceModal({ isOpen, onClose, onSubmit, booking }: AttendanceModalProps) {
  const [attendance, setAttendance] = useState<AttendanceStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setAttendance(booking.attendance ?? '');
      setNotes(booking.notes ?? '');
      setError(null);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !attendance) return;

    if (notes.length > 1000) {
      setError('Las notas no pueden superar los 1000 caracteres.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const data: UpdateAttendanceDto = { attendance };
      if (notes.trim()) data.notes = notes.trim();
      await onSubmit(booking.id, data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el presentismo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) return null;

  const studentName =
    booking.student?.firstName && booking.student?.lastName
      ? `${booking.student.firstName} ${booking.student.lastName}`
      : booking.student?.user?.email ?? 'Alumno';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Presentismo">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Alumno info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Alumno</p>
          <p className="text-sm font-semibold text-gray-900">{studentName}</p>
        </div>

        {/* Opciones de asistencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asistencia <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {ATTENDANCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAttendance(opt.value)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  attendance === opt.value
                    ? `${opt.color} border-current shadow-sm`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label htmlFor="attendance-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notas{' '}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="attendance-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Observaciones sobre la clase o el alumno..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className={`text-xs mt-1 text-right ${notes.length > 950 ? 'text-red-500' : 'text-gray-400'}`}>
            {notes.length}/1000
          </p>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!attendance || isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
