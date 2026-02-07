/**
 * Booking Service - Servicios de Gestión de Reservas
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type { Booking, CreateBookingDto, UpdateBookingDto } from '@/types';

export const bookingService = {
  /**
   * Obtener todas las reservas (filtradas según rol)
   */
  async getAll(): Promise<Booking[]> {
    return apiClient.get<Booking[]>(ENDPOINTS.BOOKINGS.BASE);
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
};
