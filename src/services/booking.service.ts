/**
 * Booking Service - Servicios de Gestión de Reservas
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type { Booking, CreateBookingDto, UpdateBookingDto, UpdateAttendanceDto } from '@/types';

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export const bookingService = {
  /**
   * Obtener todas las reservas (filtradas según rol)
   * Itera todas las páginas para traer el set completo.
   */
  async getAll(): Promise<Booking[]> {
    const first = await apiClient.get<PaginatedResponse<Booking> | Booking[]>(
      `${ENDPOINTS.BOOKINGS.BASE}?page=1&limit=50`
    );

    // Si el backend devuelve un array plano (sin paginar), retornar directo
    if (Array.isArray(first)) return first;

    const { data, total, limit } = first;
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return data;

    // Pedir el resto de páginas en paralelo
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        apiClient.get<PaginatedResponse<Booking>>(
          `${ENDPOINTS.BOOKINGS.BASE}?page=${i + 2}&limit=${limit}`
        )
      )
    );

    return [data, ...remaining.map((r) => r.data)].flat();
  },

  /**
   * Obtener reserva por ID
   */
  async getById(id: string): Promise<Booking> {
    return apiClient.get<Booking>(ENDPOINTS.BOOKINGS.BY_ID(id));
  },

  /**
   * Crear nueva reserva
   */
  async create(data: CreateBookingDto): Promise<Booking> {
    return apiClient.post<Booking>(ENDPOINTS.BOOKINGS.BASE, data);
  },

  /**
   * Actualizar reserva (solo Admin - transferir profesor, cambiar horario)
   */
  async update(id: string, data: UpdateBookingDto): Promise<Booking> {
    return apiClient.patch<Booking>(ENDPOINTS.BOOKINGS.BY_ID(id), data);
  },

  /**
   * Cancelar reserva
   */
  async cancel(id: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.BOOKINGS.BY_ID(id));
  },

  /**
   * Confirmar reserva (solo Admin)
   */
  async confirm(id: string): Promise<Booking> {
    return apiClient.patch<Booking>(ENDPOINTS.BOOKINGS.CONFIRM(id));
  },

  /**
   * Asignar clase directamente a alumno (solo Admin)
   */
  async adminAssign(data: import('@/types').AdminAssignBookingDto): Promise<Booking> {
    return apiClient.post<Booking>(ENDPOINTS.BOOKINGS.ADMIN_ASSIGN, data);
  },

  /**
   * Crear clases mensuales recurrentes (solo Admin)
   */
  async createMonthly(data: import('@/types').MonthlyBookingDto): Promise<import('@/types').MonthlyBookingResult> {
    return apiClient.post<import('@/types').MonthlyBookingResult>(ENDPOINTS.BOOKINGS.MONTHLY, data);
  },

  /**
   * Obtener grupos recurrentes
   */
  async getRecurringGroups(): Promise<import('@/types').RecurringGroup[]> {
    return apiClient.get<import('@/types').RecurringGroup[]>(ENDPOINTS.BOOKINGS.RECURRING_GROUPS);
  },

  /**
   * Renovar grupo recurrente al mes siguiente
   */
  async renewMonthly(groupId: string): Promise<import('@/types').MonthlyBookingResult> {
    return apiClient.post<import('@/types').MonthlyBookingResult>(ENDPOINTS.BOOKINGS.RENEW_MONTHLY(groupId));
  },

  /**
   * Marcar presentismo del alumno (Profesor/Admin - solo en CONFIRMED)
   */
  async updateAttendance(id: string, data: UpdateAttendanceDto): Promise<Booking> {
    return apiClient.patch<Booking>(ENDPOINTS.BOOKINGS.ATTENDANCE(id), data);
  },
};
