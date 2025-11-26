/**
 * Booking Service - Servicios de Gestión de Reservas
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type { Booking, CreateBookingDto } from '@/types';

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
   * Cancelar reserva
   */
  async cancel(id: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.BOOKINGS.BY_ID(id));
  },
};
