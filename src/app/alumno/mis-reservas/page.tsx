'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { bookingService } from '@/services';
import { Booking } from '@/types';
import { Loader2, Calendar, Clock } from 'lucide-react';
import { format } from '@/utils/format';
import { useConfirm } from '@/hooks';
import { ConfirmDialog } from '@/components/ui';

export default function MisReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { confirm, confirmProps } = useConfirm();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    const ok = await confirm({
      title: 'Cancelar reserva',
      message: '¿Estás seguro de que quieres cancelar esta reserva?',
      confirmText: 'Sí, cancelar',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await bookingService.cancel(id);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar reserva');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p className="text-gray-600 mt-1">Gestiona tus clases programadas</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No tienes reservas programadas</p>
          <motion.a
            href="/alumno/reservar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reservar Mi Primera Clase
          </motion.a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.teacher
                          ? `${booking.teacher.firstName} ${booking.teacher.lastName}`
                          : 'Profesor no especificado'}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {format.bookingStatus(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 ml-15">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{format.date(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCancel(booking.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ConfirmDialog {...confirmProps} />
    </div>
  );
}
