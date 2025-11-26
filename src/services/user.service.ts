/**
 * User Service - Servicios de Gestión de Usuarios
 */

import { apiClient } from './api';
import { ENDPOINTS } from '@/config/api.config';
import type { User, UpdateUserRolesDto } from '@/types';

export const userService = {
  /**
   * Obtener todos los usuarios (solo ADMIN)
   */
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BASE);
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id: string): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Actualizar roles de usuario (solo ADMIN)
   */
  async updateRoles(id: string, data: UpdateUserRolesDto): Promise<User> {
    return apiClient.patch<User>(ENDPOINTS.USERS.UPDATE_ROLES(id), data);
  },
};
