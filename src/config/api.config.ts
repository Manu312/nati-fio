/**
 * API Configuration
 * Configuración centralizada para la comunicación con el backend
 */

// Debug: Log environment variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

console.log('🔧 [API Config] Environment:', process.env.NODE_ENV);
console.log('🔧 [API Config] NEXT_PUBLIC_API_URL:', apiUrl);
console.log('🔧 [API Config] Is URL defined:', !!apiUrl);

if (!apiUrl) {
  console.warn('⚠️ [API Config] WARNING: NEXT_PUBLIC_API_URL is not defined!');
  console.warn('⚠️ [API Config] Available env vars with NEXT_PUBLIC:', 
    Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  );
}

export const API_CONFIG = {
  BASE_URL: apiUrl || 'http://localhost:3000', // Fallback para desarrollo
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
} as const;

console.log('🔧 [API Config] Final BASE_URL:', API_CONFIG.BASE_URL);

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
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;
