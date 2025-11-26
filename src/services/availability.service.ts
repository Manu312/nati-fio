/**
 * Availability Service - Servicios de Gestión de Disponibilidad
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type { Availability, CreateAvailabilityDto, UpdateAvailabilityDto } from '@/types';

export const availabilityService = {
  /**
   * Obtener todas las disponibilidades
   */
  async getAll(): Promise<Availability[]> {
    return apiClient.get<Availability[]>(ENDPOINTS.AVAILABILITY.BASE, false);
  },

  /**
   * Obtener disponibilidad por ID
   */
  async getById(id: string): Promise<Availability> {
    return apiClient.get<Availability>(ENDPOINTS.AVAILABILITY.BY_ID(id), false);
  },

  /**
   * Crear nueva disponibilidad (solo ADMIN)
   */
  async create(data: CreateAvailabilityDto): Promise<Availability> {
    return apiClient.post<Availability>(ENDPOINTS.AVAILABILITY.BASE, data);
  },

  /**
   * Actualizar disponibilidad (solo ADMIN)
   */
  async update(id: string, data: UpdateAvailabilityDto): Promise<Availability> {
    return apiClient.patch<Availability>(ENDPOINTS.AVAILABILITY.BY_ID(id), data);
  },

  /**
   * Eliminar disponibilidad (solo ADMIN)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.AVAILABILITY.BY_ID(id));
  },

  /**
   * Obtener disponibilidad de un profesor específico
   */
  async getByTeacherId(teacherId: string): Promise<Availability[]> {
    const all = await this.getAll();
    return all.filter((av) => av.teacherId === teacherId);
  },
};
