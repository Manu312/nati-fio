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
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
    email: string;
    user?: {
      email: string;
    };
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateBookingDto {
  teacherId: string;
  studentId: string;
  date: string;
  startTime: string;
  endTime: string;
}
