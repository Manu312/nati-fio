/**
 * Subject Service - Servicios de Gestión de Materias
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from '@/types/teacher';

export const subjectService = {
  /**
   * Obtener todas las materias
   */
  async getAll(): Promise<Subject[]> {
    return apiClient.get<Subject[]>(ENDPOINTS.SUBJECTS.BASE, false);
  },

  /**
   * Obtener materia por ID
   */
  async getById(id: number): Promise<Subject> {
    return apiClient.get<Subject>(ENDPOINTS.SUBJECTS.BY_ID(id.toString()), false);
  },

  /**
   * Crear nueva materia (solo ADMIN)
   */
  async create(data: CreateSubjectDto): Promise<Subject> {
    return apiClient.post<Subject>(ENDPOINTS.SUBJECTS.BASE, data);
  },

  /**
   * Actualizar materia (solo ADMIN)
   */
  async update(id: number, data: UpdateSubjectDto): Promise<Subject> {
    return apiClient.patch<Subject>(ENDPOINTS.SUBJECTS.BY_ID(id.toString()), data);
  },

  /**
   * Eliminar materia (solo ADMIN)
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.SUBJECTS.BY_ID(id.toString()));
  },
};
