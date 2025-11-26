/**
 * Teacher Service - Servicios de Gestión de Profesores
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type {
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto,
} from '@/types';

export const teacherService = {
  /**
   * Obtener todos los profesores
   */
  async getAll(): Promise<Teacher[]> {
    return apiClient.get<Teacher[]>(ENDPOINTS.TEACHERS.BASE, false);
  },

  /**
   * Obtener profesor por ID
   */
  async getById(id: string): Promise<Teacher> {
    return apiClient.get<Teacher>(ENDPOINTS.TEACHERS.BY_ID(id), false);
  },

  /**
   * Crear nuevo profesor (solo ADMIN)
   */
  async create(data: CreateTeacherDto): Promise<Teacher> {
    return apiClient.post<Teacher>(ENDPOINTS.TEACHERS.BASE, data);
  },

  /**
   * Actualizar profesor (solo ADMIN)
   */
  async update(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    return apiClient.patch<Teacher>(ENDPOINTS.TEACHERS.BY_ID(id), data);
  },

  /**
   * Eliminar profesor (solo ADMIN)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.TEACHERS.BY_ID(id));
  },
};
