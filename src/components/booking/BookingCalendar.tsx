'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  parseISO,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Clock, User, BookOpen, X, Edit2 } from 'lucide-react';
import type { Booking } from '@/types';
import { BookingStatus } from '@/types';

interface BookingCalendarProps {
  bookings: Booking[];
  isAdmin?: boolean;
  onEditBooking?: (booking: Booking) => void;
  onConfirmBooking?: (id: string) => void;
  onCancelBooking?: (id: string) => void;
}

type ViewType = 'month' | 'week';

const statusConfig: Record<BookingStatus, { label: string; bgColor: string; textColor: string; dotColor: string }> = {
  [BookingStatus.PENDING]: { 
    label: 'Pendiente', 
    bgColor: 'bg-amber-50 border-amber-200 hover:bg-amber-100', 
    textColor: 'text-amber-800',
    dotColor: 'bg-amber-500'
  },
  [BookingStatus.CONFIRMED]: { 
    label: 'Confirmada', 
    bgColor: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', 
    textColor: 'text-emerald-800',
    dotColor: 'bg-emerald-500'
  },
  [BookingStatus.CANCELLED]: { 
    label: 'Cancelada', 
    bgColor: 'bg-red-50 border-red-200 hover:bg-red-100', 
    textColor: 'text-red-800',
    dotColor: 'bg-red-500'
  },
  [BookingStatus.COMPLETED]: { 
    label: 'Completada', 
    bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100', 
    textColor: 'text-blue-800',
    dotColor: 'bg-blue-500'
  },
};

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 - 21:00

export function BookingCalendar({
  bookings,
  isAdmin = false,
  onEditBooking,
  onConfirmBooking,
  onCancelBooking,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Parse booking date helper
  const getBookingDate = (booking: Booking): Date => {
    try {
      const dateStr = booking.date.includes('T') ? booking.date.split('T')[0] : booking.date;
      return parseISO(dateStr);
    } catch {
      return new Date();
    }
  };

  const getBookingTime = (timeStr: string): { hours: number; minutes: number } => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
  };

  // Generate calendar days for month view
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Generate calendar days for week view
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((booking) => {
      const dateKey = format(getBookingDate(booking), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(booking);
    });
    // Sort bookings by time within each day
    map.forEach((dayBookings) => {
      dayBookings.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return map;
  }, [bookings]);

  const navigatePrev = () => {
    if (viewType === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewType === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderBookingChip = (booking: Booking, compact = false) => {
    const config = statusConfig[booking.status as BookingStatus] || statusConfig[BookingStatus.PENDING];
    const startTime = booking.startTime.substring(0, 5);

    if (compact) {
      return (
        <button
          key={booking.id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(booking);
          }}
          className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate border ${config.bgColor} ${config.textColor} transition-colors`}
        >
          <span className="font-medium">{startTime}</span>
          <span className="ml-1 opacity-75">{booking.student?.firstName || 'Alumno'}</span>
        </button>
      );
    }

    return (
      <button
        key={booking.id}
        onClick={() => setSelectedBooking(booking)}
        className={`w-full text-left p-2 rounded-lg border ${config.bgColor} ${config.textColor} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          <span className="font-medium text-sm">
            {startTime} - {booking.endTime.substring(0, 5)}
          </span>
        </div>
        <p className="text-sm mt-1 font-medium truncate">
          {booking.student?.firstName} {booking.student?.lastName}
        </p>
        {booking.subject?.name && (
          <p className="text-xs opacity-75 truncate">{booking.subject.name}</p>
        )}
      </button>
    );
  };

  // Month View
  const renderMonthView = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-gray-600 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {monthDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayBookings = bookingsByDate.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dateKey}
              className={`min-h-[100px] lg:min-h-[120px] p-1 border-b border-r border-gray-100 ${
                !isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
              } ${index % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <div className="flex items-center justify-center mb-1">
                <span
                  className={`w-7 h-7 flex items-center justify-center text-sm rounded-full ${
                    isCurrentDay
                      ? 'bg-blue-600 text-white font-bold'
                      : isCurrentMonth
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-0.5 overflow-hidden">
                {dayBookings.slice(0, 3).map((booking) => renderBookingChip(booking, true))}
                {dayBookings.length > 3 && (
                  <button
                    onClick={() => {
                      // Could open a day detail modal here
                    }}
                    className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium py-0.5"
                  >
                    +{dayBookings.length - 3} más
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Week View
  const renderWeekView = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="px-2 py-3 text-center text-sm font-semibold text-gray-400 bg-gray-50 border-r border-gray-200">
          Hora
        </div>
        {weekDays.map((day) => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`px-2 py-2 text-center border-r border-gray-100 last:border-r-0 ${
                isCurrentDay ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <p className="text-xs text-gray-500 uppercase">
                {format(day, 'EEE', { locale: es })}
              </p>
              <p
                className={`text-lg font-bold ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
            <div className="px-2 py-3 text-xs text-gray-500 text-right pr-3 border-r border-gray-200 bg-gray-50/50">
              {String(hour).padStart(2, '0')}:00
            </div>
            {weekDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayBookings = bookingsByDate.get(dateKey) || [];
              const hourBookings = dayBookings.filter((b) => {
                const { hours } = getBookingTime(b.startTime);
                return hours === hour;
              });

              return (
                <div
                  key={`${dateKey}-${hour}`}
                  className={`p-1 min-h-[60px] border-r border-gray-100 last:border-r-0 ${
                    isToday(day) ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="space-y-1">
                    {hourBookings.map((booking) => renderBookingChip(booking, true))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // Booking Detail Modal
  const renderBookingModal = () => {
    if (!selectedBooking) return null;

    const config = statusConfig[selectedBooking.status as BookingStatus] || statusConfig[BookingStatus.PENDING];
    const bookingDate = getBookingDate(selectedBooking);

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-10"
          >
            {/* Header with status color */}
            <div className={`px-6 py-4 ${config.bgColor} border-b`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${config.dotColor}`} />
                  <span className={`font-semibold ${config.textColor}`}>
                    {config.label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Student info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.student?.firstName} {selectedBooking.student?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.student?.email || selectedBooking.student?.user?.email}
                  </p>
                </div>
              </div>

              {/* Subject */}
              {selectedBooking.subject?.name && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Materia</p>
                    <p className="font-medium text-gray-900">{selectedBooking.subject.name}</p>
                  </div>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha y hora</p>
                  <p className="font-medium text-gray-900">
                    {format(bookingDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.startTime.substring(0, 5)} - {selectedBooking.endTime.substring(0, 5)}
                  </p>
                </div>
              </div>

              {/* Teacher (for admin view) */}
              {isAdmin && selectedBooking.teacher && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profesor</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.teacher.firstName} {selectedBooking.teacher.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions - Only for admin */}
            {isAdmin && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                {selectedBooking.status === BookingStatus.PENDING && (
                  <>
                    <button
                      onClick={() => {
                        onConfirmBooking?.(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => {
                        onCancelBooking?.(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    onEditBooking?.(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrev}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={navigateNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 ml-2">
            {viewType === 'month'
              ? format(currentDate, 'MMMM yyyy', { locale: es })
              : `Semana del ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d 'de' MMMM", { locale: es })}`}
          </h2>
        </div>

        {/* View toggle & Today button */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Hoy
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewType === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Mes</span>
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewType === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Semana</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
            <span className="text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {viewType === 'month' ? renderMonthView() : renderWeekView()}

      {/* Booking Detail Modal */}
      {selectedBooking && renderBookingModal()}
    </div>
  );
}
