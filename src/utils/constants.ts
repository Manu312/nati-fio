/**
 * Constants
 * Constantes globales de la aplicación
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NOSOTROS: '/nosotros',
  RESERVAR: '/reservar',
  
  // Admin routes
  ADMIN: {
    HOME: '/admin',
    USUARIOS: '/admin/usuarios',
    PROFESORES: '/admin/profesores',
    MATERIAS: '/admin/materias',
    DISPONIBILIDAD: '/admin/disponibilidad',
    RESERVAS: '/admin/reservas',
  },
  
  // Alumno routes
  ALUMNO: {
    HOME: '/alumno',
    RESERVAR: '/alumno/reservar',
    MIS_RESERVAS: '/alumno/mis-reservas',
  },
  
  // Profesor routes (futuro)
  PROFESOR: {
    HOME: '/profesor',
    MIS_RESERVAS: '/profesor/mis-reservas',
    DISPONIBILIDAD: '/profesor/disponibilidad',
  },
  
  // Servicios
  SERVICIOS: {
    CLASES_PARTICULARES: '/servicios/clases-particulares',
    INGRESO: '/servicios/ingreso',
    OLIMPIADAS: '/servicios/olimpiadas',
  },
} as const;

export const APP_NAME = 'Naty & Fio';

export const BOOKING_DURATIONS = [
  { label: '30 minutos', value: 30 },
  { label: '1 hora', value: 60 },
  { label: '1.5 horas', value: 90 },
  { label: '2 horas', value: 120 },
] as const;

export const EDUCATION_LEVELS = [
  { label: 'Primaria', value: 'primaria' },
  { label: 'Secundaria', value: 'secundaria' },
  { label: 'Universidad', value: 'universidad' },
  { label: 'Olimpíadas', value: 'olimpiadas' },
] as const;
