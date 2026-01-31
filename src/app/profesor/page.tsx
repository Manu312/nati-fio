'use client';

import { useState, useEffect } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole, BookingStatus } from '@/types';
import type { Booking, Availability } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { bookingService } from '@/services/booking.service';
import { availabilityService } from '@/services/availability.service';
import { format, parseISO, isToday, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

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

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function ProfesorDashboard() {
  const { isLoading, user } = useProtectedRoute({ requiredRoles: [UserRole.PROFESOR] });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      loadData();
    }
  }, [isLoading, user]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [bookingsData, availabilityData] = await Promise.all([
        bookingService.getAll(),
        availabilityService.getAll(),
      ]);
      setBookings(bookingsData);
      setAvailabilities(availabilityData);
    } catch (error) {
      // Silently handle error
    } finally {
      setIsLoadingData(false);
    }
  };

  // Calcular estadísticas
  const todayBookings = bookings.filter(b => {
    const bookingDate = parseBookingDateTime(b.date, b.startTime);
    return isToday(bookingDate) && (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING);
  });

  const weekBookings = bookings.filter(b => {
    const bookingDate = parseBookingDateTime(b.date, b.startTime);
    return isThisWeek(bookingDate) && (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING);
  });

  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);

  // Alumnos únicos
  const uniqueStudents = new Set(bookings.map(b => b.studentId)).size;

  // Próximas clases (confirmadas y pendientes)
  const upcomingClasses = bookings
    .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING)
    .sort((a, b) => {
      const dateA = parseBookingDateTime(a.date, a.startTime);
      const dateB = parseBookingDateTime(b.date, b.startTime);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Reservas Hoy', value: String(todayBookings.length), icon: Calendar, color: 'blue' },
    { label: 'Esta Semana', value: String(weekBookings.length), icon: Clock, color: 'purple' },
    { label: 'Alumnos', value: String(uniqueStudents), icon: Users, color: 'green' },
    { label: 'Completadas', value: String(completedBookings.length), icon: CheckCircle, color: 'orange' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, Profesor
        </h1>
        <p className="text-gray-600 mt-2">
          Panel de control para gestionar tus clases y disponibilidad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Próximas Clases
          </h3>
          {isLoadingData ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : upcomingClasses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tienes clases programadas
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.student?.firstName} {booking.student?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(parseBookingDateTime(booking.date, booking.startTime), "EEE d MMM", { locale: es })} • {format(parseBookingDateTime(booking.date, booking.startTime), 'HH:mm', { locale: es })} - {format(parseBookingDateTime(booking.date, booking.endTime), 'HH:mm', { locale: es })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === BookingStatus.CONFIRMED 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === BookingStatus.CONFIRMED ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
              ))}
              <Link href={ROUTES.PROFESOR.MIS_RESERVAS}>
                <p className="text-center text-blue-600 hover:text-blue-700 text-sm mt-2 cursor-pointer">
                  Ver todas →
                </p>
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Tu Disponibilidad
          </h3>
          {isLoadingData ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : availabilities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Configura tu disponibilidad horaria</p>
              <Link href={ROUTES.PROFESOR.DISPONIBILIDAD}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Configurar
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {availabilities.slice(0, 5).map((av) => (
                <div
                  key={av.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{dayNames[av.dayOfWeek]}</span>
                  <span className="text-sm text-gray-600">
                    {av.startTime} - {av.endTime}
                  </span>
                </div>
              ))}
              {availabilities.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{availabilities.length - 5} horarios más
                </p>
              )}
              <Link href={ROUTES.PROFESOR.DISPONIBILIDAD}>
                <p className="text-center text-blue-600 hover:text-blue-700 text-sm mt-2 cursor-pointer">
                  Gestionar disponibilidad →
                </p>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
