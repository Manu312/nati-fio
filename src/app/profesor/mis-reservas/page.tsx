'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks';
import { UserRole, BookingStatus, AttendanceStatus } from '@/types';
import type { Booking, Teacher, UpdateAttendanceDto } from '@/types';
import { bookingService } from '@/services/booking.service';
import { teacherService } from '@/services';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { AttendanceModal } from '@/components/admin/AttendanceModal';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, List, ChevronUp, ChevronDown } from 'lucide-react';

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

const attendanceMap: Record<string, { label: string; className: string }> = {
  PRESENT: { label: 'Presente', className: 'bg-green-100 text-green-700' },
  ABSENT: { label: 'Ausente', className: 'bg-red-100 text-red-700' },
};

export default function ProfesorReservasPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.PROFESOR] });
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [attendanceBooking, setAttendanceBooking] = useState<Booking | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    if (statusFilter) result = result.filter(b => b.status === statusFilter);
    result.sort((a, b) => {
      const valA = `${a.date}${a.startTime}`;
      const valB = `${b.date}${b.startTime}`;
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    return result;
  }, [bookings, statusFilter, sortDir]);

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

  const handleAttendanceSubmit = async (bookingId: string, data: UpdateAttendanceDto) => {
    await bookingService.updateAttendance(bookingId, data);
    loadBookings();
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
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="CANCELLED">Cancelada</option>
              <option value="COMPLETED">Completada</option>
            </select>
            <button
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 hover:bg-gray-50"
            >
              Fecha {sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {statusFilter && (
              <p className="text-sm text-gray-500">
                {filteredBookings.length} de {bookings.length}
              </p>
            )}
          </div>
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Sin resultados para los filtros aplicados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map((booking, index) => (
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

              {booking.attendance && (
                <div className="mt-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${attendanceMap[booking.attendance]?.className ?? 'bg-gray-100 text-gray-600'}`}>
                    Asistencia: {attendanceMap[booking.attendance]?.label ?? booking.attendance}
                  </span>
                  {booking.notes && (
                    <p className="mt-2 text-xs text-gray-500 italic">{booking.notes}</p>
                  )}
                </div>
              )}

              {booking.status === BookingStatus.CONFIRMED && (
                <div className="mt-4">
                  <button
                    onClick={() => { setAttendanceBooking(booking); setIsAttendanceModalOpen(true); }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                  >
                    {booking.attendance ? 'Editar presentismo' : 'Registrar presentismo'}
                  </button>
                </div>
              )}
            </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de presentismo */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          setIsAttendanceModalOpen(false);
          setAttendanceBooking(null);
        }}
        onSubmit={handleAttendanceSubmit}
        booking={attendanceBooking}
      />
    </div>
  );
}
