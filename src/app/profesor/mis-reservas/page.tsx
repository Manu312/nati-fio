'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole } from '@/types';
import type { Booking } from '@/types';
import { bookingService } from '@/services/booking.service';
import { Button } from '@/components/ui/Button';

export default function ProfesorReservasPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.PROFESOR] });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoadingData(true);
      // Aquí se debería filtrar solo las reservas del profesor actual
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p className="text-gray-600 mt-2">Clases programadas con tus alumnos</p>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No tienes reservas programadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Alumno: {booking.student?.email || 'No disponible'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Estado: <span className={`font-medium ${
                      booking.status === 'CONFIRMED' ? 'text-green-600' :
                      booking.status === 'CANCELLED' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {booking.status === 'PENDING' ? 'Pendiente' :
                       booking.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
                    </span>
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {new Date(booking.startTime).toLocaleDateString()}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>⏰ {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
