'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { TimeSelect } from '@/components/ui';
import { bookingService, availabilityService } from '@/services';
import { Teacher, Availability, Booking } from '@/types';
import { useAuth } from '@/hooks';
import { validation, format } from '@/utils';
import { validateBooking, getAvailableSlots } from '@/utils/booking-validation';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacher: Teacher | null;
}

export function CreateBookingModal({
  isOpen,
  onClose,
  onSuccess,
  teacher,
}: CreateBookingModalProps) {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Array<{ startTime: string; endTime: string; available: boolean }>>([]);

  useEffect(() => {
    if (isOpen && teacher) {
      loadAvailabilitiesAndBookings();
    }
  }, [isOpen, teacher]);

  useEffect(() => {
    if (date && teacher) {
      const slots = getAvailableSlots(date, teacher.id, availabilities, existingBookings);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [date, teacher, availabilities, existingBookings]);

  const loadAvailabilitiesAndBookings = async () => {
    try {
      // Cargar disponibilidades (no requiere auth)
      const allAvailabilities = await availabilityService.getAll();
      setAvailabilities(allAvailabilities);
      
      // Intentar cargar bookings existentes (requiere auth)
      try {
        const allBookings = await bookingService.getAll();
        setExistingBookings(allBookings);
      } catch (bookingErr) {
        console.warn('No se pudieron cargar las reservas existentes:', bookingErr);
        // Continuar sin las reservas existentes - el usuario podrá hacer la reserva
        // y el backend validará si hay conflictos
        setExistingBookings([]);
      }
    } catch (err) {
      console.error('Error loading availabilities:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teacher || !user) return;

    // Validaciones básicas
    if (!validation.isFutureDate(date)) {
      setError('La fecha debe ser futura');
      return;
    }

    if (!validation.isValidTime(startTime) || !validation.isValidTime(endTime)) {
      setError('Las horas deben tener formato HH:mm');
      return;
    }

    if (!validation.isValidTimeRange(startTime, endTime)) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    // Validaciones de disponibilidad y solapamiento
    const validationResult = validateBooking(
      date,
      startTime,
      endTime,
      teacher.id,
      availabilities,
      existingBookings
    );

    if (!validationResult.valid) {
      setError(validationResult.error || 'Error de validación');
      return;
    }

    setIsLoading(true);

    try {
      const bookingDate = new Date(date);
      
      await bookingService.create({
        teacherId: teacher.id,
        studentId: user.id,
        date: bookingDate.toISOString(),
        startTime,
        endTime,
      });

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDate('');
    setStartTime('');
    setEndTime('');
    setError('');
    onClose();
  };

  if (!teacher) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reservar Clase">
      <div className="space-y-4">
        {/* Teacher Info */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-1">
            {format.fullName(teacher.firstName, teacher.lastName)}
          </h3>
          {teacher.bio && (
            <p className="text-sm text-gray-600 line-clamp-2">{teacher.bio}</p>
          )}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <span
                  key={subject.id}
                  className="px-2 py-1 bg-white text-blue-600 text-xs rounded-full font-medium"
                >
                  {subject.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de la Clase *
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format.dateForInput(new Date())}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Available Slots Preview */}
          {date && availableSlots.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                Franjas disponibles:
              </p>
              <div className="space-y-1">
                {availableSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm"
                  >
                    {slot.available ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={slot.available ? 'text-green-700' : 'text-red-700 line-through'}>
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {!slot.available && (
                      <span className="text-xs text-red-600">(ocupada)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {date && availableSlots.length === 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ El profesor no tiene disponibilidad configurada para este día
              </p>
            </div>
          )}

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de Inicio *"
              required
              value={startTime}
              onChange={setStartTime}
            />

            <TimeSelect
              label="Hora de Fin *"
              required
              value={endTime}
              onChange={setEndTime}
              minTime={startTime}
            />
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700">
              <strong>Nota:</strong> La reserva quedará pendiente de confirmación por el profesor.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              Confirmar Reserva
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
