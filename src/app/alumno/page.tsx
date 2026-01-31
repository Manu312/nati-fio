'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { bookingService } from '@/services/booking.service';
import { BookingStatus } from '@/types';
import type { Booking } from '@/types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

const quickActions = [
  {
    icon: Calendar,
    title: 'Reservar Clase',
    description: 'Agenda una nueva clase con un profesor',
    href: ROUTES.ALUMNO.RESERVAR,
    color: 'blue',
  },
  {
    icon: Clock,
    title: 'Mis Reservas',
    description: 'Ver y gestionar tus clases programadas',
    href: ROUTES.ALUMNO.MIS_RESERVAS,
    color: 'purple',
  },
];

export default function AlumnoDashboard() {
  const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUpcomingClasses();
  }, []);

  const loadUpcomingClasses = async () => {
    try {
      setIsLoading(true);
      const bookings = await bookingService.getAll();
      // Filtrar solo confirmadas y pendientes, ordenar por fecha
      const upcoming = bookings
        .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING)
        .sort((a, b) => {
          const dateA = parseBookingDateTime(a.date, a.startTime);
          const dateB = parseBookingDateTime(b.date, b.startTime);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 5); // Mostrar solo las próximas 5
      setUpcomingClasses(upcoming);
    } catch (error) {
      // Silently handle error
    } finally {
      setIsLoading(false);
    }
  };

  const statusMap: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-600 mt-1">Bienvenido a tu espacio de aprendizaje</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-${action.color}-200 transition-all cursor-pointer group`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-${action.color}-50 rounded-lg group-hover:bg-${action.color}-100 transition-colors`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Clases</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : upcomingClasses.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes clases programadas</p>
            <Link href={ROUTES.ALUMNO.RESERVAR}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Reservar Primera Clase
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingClasses.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.teacher?.firstName} {booking.teacher?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(parseBookingDateTime(booking.date, booking.startTime), "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(parseBookingDateTime(booking.date, booking.startTime), 'HH:mm', { locale: es })} - {format(parseBookingDateTime(booking.date, booking.endTime), 'HH:mm', { locale: es })}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusMap[booking.status]?.className || 'bg-gray-100 text-gray-800'}`}>
                      {statusMap[booking.status]?.label || booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link href={ROUTES.ALUMNO.MIS_RESERVAS}>
              <p className="text-center text-blue-600 hover:text-blue-700 text-sm mt-4 cursor-pointer">
                Ver todas mis reservas →
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
