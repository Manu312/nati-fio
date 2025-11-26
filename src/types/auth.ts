/**
 * Auth Types - Sistema de Autenticación
 * Define todos los tipos relacionados con autenticación y autorización
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESOR = 'PROFESOR',
  ALUMNO = 'ALUMNO',
}

export interface User {
  id: string;
  email: string;
  roles: UserRole[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  roles?: UserRole[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
