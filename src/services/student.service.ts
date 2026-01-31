/**
 * Student Service
 * Servicio para gestión de alumnos (solo admin)
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import { Student, CreateStudentDto, UpdateStudentDto } from '@/types';

export const studentService = {
  /**
   * Obtiene todos los alumnos
   */
  async getAll(): Promise<Student[]> {
    return apiClient.get<Student[]>(ENDPOINTS.STUDENTS.BASE);
  },

  /**
   * Obtiene un alumno por ID
   */
  async getById(id: string): Promise<Student> {
    return apiClient.get<Student>(ENDPOINTS.STUDENTS.BY_ID(id));
  },

  /**
   * Crea un nuevo alumno
   */
  async create(data: CreateStudentDto): Promise<Student> {
    return apiClient.post<Student>(ENDPOINTS.STUDENTS.BASE, data);
  },

  /**
   * Actualiza un alumno existente
   */
  async update(id: string, data: UpdateStudentDto): Promise<Student> {
    return apiClient.patch<Student>(ENDPOINTS.STUDENTS.BY_ID(id), data);
  },

  /**
   * Elimina un alumno
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.STUDENTS.BY_ID(id));
  },
};
