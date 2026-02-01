'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks';
import { UserRole, BookingStatus } from '@/types';
import type { Booking, Teacher } from '@/types';
import { bookingService } from '@/services/booking.service';
import { teacherService } from '@/services';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, List } from 'lucide-react';

// Función auxiliar para parsear fecha y hora de forma segura
const parseBookingDateTime = (date: string, time: string): Date => {
  try {
    if (time && time.includes('T')) {
      return parseISO(time);
    }
    if (date && time) {
      const dateStr = date.includes('T') ? date.split('T')[0] : date;
      return parseISO(`${dateStr}T${time}`);
    }
    if (date) {
      return parseISO(date);
    }
    return new Date();
  } catch {
    return new Date();
  }
};

const statusMap: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Completada', className: 'bg-blue-100 text-blue-800' },
};

export default function ProfesorReservasPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.PROFESOR] });
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setIsLoadingData(true);
      
      // Obtener el teacherId del profesor actual
      const teachers = await teacherService.getAll();
      const myTeacher = teachers.find((t: Teacher) => t.userId === user?.id);
      
      if (!myTeacher) {
        setIsLoadingData(false);
        return;
      }
      
      // Filtrar solo las reservas del profesor actual
      const allBookings = await bookingService.getAll();
      const myBookings = allBookings.filter((b: Booking) => b.teacherId === myTeacher.id);
      setBookings(myBookings);
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
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">Clases programadas con tus alumnos</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 self-start">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendario</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Lista</span>
          </button>
        </div>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tienes reservas programadas</p>
          <p className="text-gray-400 text-sm mt-2">Las reservas de tus alumnos aparecerán aquí</p>
        </div>
      ) : viewMode === 'calendar' ? (
        /* Calendar View - Read Only for Profesor */
        <BookingCalendar
          bookings={bookings}
          isAdmin={false}
        />
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
                    {booking.student?.firstName && booking.student?.lastName 
                      ? `${booking.student.firstName} ${booking.student.lastName}`
                      : booking.student?.email || booking.student?.user?.email || 'Alumno'}
                  </h3>
                  {booking.subject?.name && (
                    <p className="text-sm text-blue-600 font-medium">
                      📚 {booking.subject.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {booking.student?.email || booking.student?.user?.email}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${statusMap[booking.status]?.className || 'bg-gray-100 text-gray-800'}`}>
                  {statusMap[booking.status]?.label || booking.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                  📅 {format(parseBookingDateTime(booking.date, booking.startTime), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="flex items-center gap-2">
                  ⏰ {format(parseBookingDateTime(booking.date, booking.startTime), 'HH:mm', { locale: es })} - {format(parseBookingDateTime(booking.date, booking.endTime), 'HH:mm', { locale: es })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
