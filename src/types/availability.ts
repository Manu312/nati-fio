/**
 * Availability Types - Disponibilidad de Profesores
 */

export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: 'Domingo',
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
};

export interface Availability {
  id: string;
  teacherId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateAvailabilityDto {
  teacherId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityDto {
  teacherId?: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
}
