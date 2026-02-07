/**
 * Booking Types - Sistema de Reservas
 */

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  subjectId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    user?: {
      email: string;
    };
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  subject?: {
    id: string;
    name: string;
  };
}

export interface CreateBookingDto {
  teacherId: string;
  studentId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingDto {
  teacherId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface AdminAssignBookingDto {
  studentId: string;
  teacherId: string;
  subjectId?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface MonthlyBookingDto {
  studentId: string;
  teacherId: string;
  subjectId?: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  month: number; // 1-12
  year: number;
}

export interface RecurringGroup {
  id: string;
  studentId: string;
  teacherId: string;
  subjectId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  month: number;
  year: number;
  createdAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  bookings?: Booking[];
}

export interface MonthlyBookingResult {
  recurringGroupId: string;
  totalDates: number;
  successful: Booking[];
  failed: {
    date: string;
    reason: string;
  }[];
}
