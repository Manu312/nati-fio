/**
 * User Types - Gestión de Usuarios
 */

import { User as AuthUser, UserRole } from './auth';

// Re-exportar User desde auth
export type { User } from './auth';

export interface UserProfile extends AuthUser {
  // Campos adicionales del perfil si los hay
}

export interface UpdateUserRolesDto {
  roles: UserRole[];
}
