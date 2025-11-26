/**
 * Auth Service - Servicios de Autenticación
 * Maneja login, registro y gestión de sesión
 */

import { apiClient } from './api';
import { ENDPOINTS, STORAGE_KEYS } from '@/config/api.config';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '@/types';

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
      false // No requiere auth
    );

    // NOTA: El guardado en localStorage se hace en AuthContext
    // porque necesitamos construir el user desde el JWT si no viene en la respuesta

    return response;
  },

  /**
   * Registrar nuevo usuario (solo ADMIN)
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data, true);
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Obtener token actual del localStorage
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role as any) ?? false;
  },

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    return roles.some((role) => user.roles.includes(role as any));
  },
};
