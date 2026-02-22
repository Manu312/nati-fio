'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole, BookingStatus, AttendanceStatus } from '@/types';
import type { Booking, UpdateBookingDto, UpdateAttendanceDto } from '@/types';
import { bookingService } from '@/services/booking.service';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui';
import { EditBookingModal } from '@/components/admin/EditBookingModal';
import { AttendanceModal } from '@/components/admin/AttendanceModal';
import { AssignClassModal } from '@/components/admin/AssignClassModal';
import { MonthlyClassesModal } from '@/components/admin/MonthlyClassesModal';
import { RecurringGroupsList } from '@/components/admin/RecurringGroupsList';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, List, Plus, CalendarRange, Repeat, Search, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useConfirm } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';

// Función auxiliar para parsear fecha y hora de forma segura
const parseBookingDateTime = (date: string, time: string): Date => {
  try {
    // Si el tiempo ya es un datetime completo (ISO), usarlo directamente
    if (time && time.includes('T')) {
      return parseISO(time);
    }
    // Si tenemos fecha y hora separadas, combinarlas
    if (date && time) {
      const dateStr = date.includes('T') ? date.split('T')[0] : date;
      return parseISO(`${dateStr}T${time}`);
    }
    // Si solo tenemos la fecha
    if (date) {
      return parseISO(date);
    }
    return new Date();
  } catch {
    return new Date();
  }
};

export default function ReservasAdminPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.ADMIN] });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [attendanceBooking, setAttendanceBooking] = useState<Booking | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeTab, setActiveTab] = useState<'bookings' | 'recurring'>('bookings');
  const { confirm, confirmProps } = useConfirm();
  const { showToast } = useToast();
  const [listSearch, setListSearch] = useState('');
  const [listStatusFilter, setListStatusFilter] = useState('');
  const [listSortField, setListSortField] = useState<'date' | 'alumno' | 'profesor'>('date');
  const [listSortDir, setListSortDir] = useState<'asc' | 'desc'>('asc');

  const toggleListSort = (field: typeof listSortField) => {
    if (listSortField === field) setListSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setListSortField(field); setListSortDir('asc'); }
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    if (listSearch.trim()) {
      const lower = listSearch.toLowerCase();
      result = result.filter(b =>
        (`${b.student?.firstName ?? ''} ${b.student?.lastName ?? ''}`).toLowerCase().includes(lower) ||
        (`${b.teacher?.firstName ?? ''} ${b.teacher?.lastName ?? ''}`).toLowerCase().includes(lower) ||
        (b.student?.user?.email?.toLowerCase() ?? '').includes(lower)
      );
    }
    if (listStatusFilter) {
      result = result.filter(b => b.status === listStatusFilter);
    }
    result.sort((a, b) => {
      let valA = '', valB = '';
      if (listSortField === 'date') {
        valA = `${a.date}${a.startTime}`;
        valB = `${b.date}${b.startTime}`;
      } else if (listSortField === 'alumno') {
        valA = `${a.student?.firstName ?? ''} ${a.student?.lastName ?? ''}`;
        valB = `${b.student?.firstName ?? ''} ${b.student?.lastName ?? ''}`;
      } else if (listSortField === 'profesor') {
        valA = `${a.teacher?.firstName ?? ''} ${a.teacher?.lastName ?? ''}`;
        valB = `${b.teacher?.firstName ?? ''} ${b.teacher?.lastName ?? ''}`;
      }
      return listSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    return result;
  }, [bookings, listSearch, listStatusFilter, listSortField, listSortDir]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoadingData(true);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCancel = async (id: string) => {
    const ok = await confirm({
      title: 'Cancelar reserva',
      message: '¿Estás seguro de cancelar esta reserva?',
      confirmText: 'Sí, cancelar',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await bookingService.cancel(id);
      loadBookings();
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Error al cancelar la reserva');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await bookingService.confirm(id);
      loadBookings();
    } catch (error: any) {
      showToast('error', error.message || 'Error al confirmar la reserva');
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleAttendance = (booking: Booking) => {
    setAttendanceBooking(booking);
    setIsAttendanceModalOpen(true);
  };

  const handleAttendanceSubmit = async (bookingId: string, data: UpdateAttendanceDto) => {
    await bookingService.updateAttendance(bookingId, data);
    loadBookings();
  };

  const handleEditSubmit = async (id: string, data: UpdateBookingDto) => {
    await bookingService.update(id, data);
    loadBookings();
  };

  const handleDelete = async (id: string) => {
    try {
      await bookingService.cancel(id);
      loadBookings();
    } catch (error: any) {
      showToast('error', error.message || 'Error al eliminar la reserva');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Clases</h1>
            <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">Administra reservas y clases recurrentes</p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAssignModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Asignar Clase
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMonthlyModalOpen(true)}
            >
              <CalendarRange className="w-4 h-4 mr-2" />
              Clases Mensuales
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Todas las Reservas
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'recurring'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Repeat className="w-4 h-4" />
            Grupos Recurrentes
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'bookings' ? (
        <>
          {/* View Mode Toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay reservas en el sistema</p>
              <p className="text-gray-400 text-sm mt-2">Las reservas aparecerán aquí cuando los alumnos las creen</p>
            </div>
          ) : viewMode === 'calendar' ? (
            /* Calendar View */
            <BookingCalendar
              bookings={bookings}
              isAdmin={true}
              onEditBooking={handleEdit}
              onConfirmBooking={handleConfirm}
              onCancelBooking={handleCancel}
            />
          ) : (
            <>
          {/* Toolbar de filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={listSearch}
                onChange={e => setListSearch(e.target.value)}
                placeholder="Buscar por alumno o profesor..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={listStatusFilter}
                onChange={e => setListStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="COMPLETED">Completada</option>
              </select>
              {(['date', 'alumno', 'profesor'] as const).map(field => (
                <button
                  key={field}
                  onClick={() => toggleListSort(field)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    listSortField === field ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {field === 'date' ? 'Fecha' : field === 'alumno' ? 'Alumno' : 'Profesor'}
                  {listSortField === field ? (listSortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                </button>
              ))}
            </div>
          </div>
          {(listSearch || listStatusFilter) && (
            <p className="text-sm text-gray-500 mb-3">
              {filteredBookings.length} resultado{filteredBookings.length !== 1 ? 's' : ''} de {bookings.length}
            </p>
          )}
          {/* Vista móvil - Cards */}
          <div className="lg:hidden space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.student?.firstName} {booking.student?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      con {booking.teacher?.firstName} {booking.teacher?.lastName}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    statusMap[booking.status]?.className || 'bg-gray-100 text-gray-800'
                  }`}>
                    {statusMap[booking.status]?.label || booking.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>📅 {format(parseBookingDateTime(booking.date, booking.startTime), "EEE d MMM", { locale: es })}</p>
                  <p>⏰ {format(parseBookingDateTime(booking.date, booking.startTime), 'HH:mm', { locale: es })} - {format(parseBookingDateTime(booking.date, booking.endTime), 'HH:mm', { locale: es })}</p>
                </div>

                {booking.attendance && (
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${attendanceMap[booking.attendance]?.className ?? 'bg-gray-100 text-gray-600'}`}>
                    {attendanceMap[booking.attendance]?.label ?? booking.attendance}
                  </span>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(booking)}>
                      Editar
                    </Button>
                  )}
                  {booking.status === BookingStatus.PENDING && (
                    <Button variant="primary" size="sm" onClick={() => handleConfirm(booking.id)}>
                      Confirmar
                    </Button>
                  )}
                  {booking.status === BookingStatus.CONFIRMED && (
                    <Button variant="secondary" size="sm" onClick={() => handleAttendance(booking)}>
                      Presentismo
                    </Button>
                  )}
                  {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
                    <Button variant="danger" size="sm" onClick={() => handleCancel(booking.id)}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Vista desktop - Tabla */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => toggleListSort('alumno')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Alumno
                      {listSortField === 'alumno' ? (listSortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleListSort('profesor')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Profesor
                      {listSortField === 'profesor' ? (listSortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleListSort('date')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Fecha y Hora
                      {listSortField === 'date' ? (listSortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.student?.firstName} {booking.student?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.student?.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.teacher?.firstName} {booking.teacher?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(parseBookingDateTime(booking.date, booking.startTime), "dd 'de' MMMM, yyyy", { locale: es })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(parseBookingDateTime(booking.date, booking.startTime), 'HH:mm', { locale: es })} - {' '}
                        {format(parseBookingDateTime(booking.date, booking.endTime), 'HH:mm', { locale: es })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        statusMap[booking.status]?.className || 'bg-gray-100 text-gray-800'
                      }`}>
                        {statusMap[booking.status]?.label || booking.status}
                      </span>
                      {booking.attendance && (
                        <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${attendanceMap[booking.attendance]?.className ?? 'bg-gray-100 text-gray-600'}`}>
                          {attendanceMap[booking.attendance]?.label ?? booking.attendance}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(booking)}
                        >
                          Editar
                        </Button>
                      )}
                      {booking.status === BookingStatus.PENDING && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirm(booking.id)}
                        >
                          Confirmar
                        </Button>
                      )}
                      {booking.status === BookingStatus.CONFIRMED && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAttendance(booking)}
                        >
                          Presentismo
                        </Button>
                      )}
                      {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
          )}
        </>
      ) : (
        /* Tab: Grupos Recurrentes */
        <RecurringGroupsList onUpdate={loadBookings} />
      )}

      {/* Modales */}
      {/* Modal de edición */}
      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBooking(null);
        }}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
        booking={editingBooking}
      />

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

      {/* Modal de asignar clase individual */}
      <AssignClassModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={loadBookings}
      />

      {/* Modal de clases mensuales */}
      <MonthlyClassesModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        onSuccess={loadBookings}
      />

      <ConfirmDialog {...confirmProps} />
    </div>
  );
}
