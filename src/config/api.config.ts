/**
 * API Configuration
 * Configuración centralizada para la comunicación con el backend
 */

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const API_CONFIG = {
  BASE_URL: apiUrl || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_ROLES: (id: string) => `/users/${id}/roles`,
  },
  // Teachers
  TEACHERS: {
    BASE: '/teachers',
    BY_ID: (id: string) => `/teachers/${id}`,
  },
  // Subjects
  SUBJECTS: {
    BASE: '/subjects',
    BY_ID: (id: string) => `/subjects/${id}`,
  },
  // Availability
  AVAILABILITY: {
    BASE: '/availability',
    BY_ID: (id: string) => `/availability/${id}`,
  },
  // Bookings
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    CONFIRM: (id: string) => `/bookings/${id}/confirm`,
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;
