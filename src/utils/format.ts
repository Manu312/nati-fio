/**
 * Format Utilities
 * Funciones de formateo de datos
 */

import { DayOfWeek, DAY_NAMES } from '@/types';

export const format = {
  /**
   * Formatea una fecha a DD/MM/YYYY
   */
  date(date: string | Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  /**
   * Formatea una fecha a formato ISO para inputs
   */
  dateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Formatea una hora a formato 12h (AM/PM)
   */
  time12h(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  },

  /**
   * Formatea nombre completo
   */
  fullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
  },

  /**
   * Formatea día de la semana
   */
  dayOfWeek(day: DayOfWeek): string {
    return DAY_NAMES[day];
  },

  /**
   * Formatea rango de tiempo
   */
  timeRange(startTime: string, endTime: string): string {
    return `${startTime} - ${endTime}`;
  },

  /**
   * Formatea estado de reserva
   */
  bookingStatus(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmada',
      CANCELLED: 'Cancelada',
    };
    return statusMap[status] || status;
  },

  /**
   * Formatea rol de usuario
   */
  userRole(role: string): string {
    const roleMap: Record<string, string> = {
      ADMIN: 'Administrador',
      PROFESOR: 'Profesor',
      ALUMNO: 'Alumno',
    };
    return roleMap[role] || role;
  },

  /**
   * Formatea fecha y hora relativa (hace X tiempo)
   */
  timeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return this.date(date);
  },
};
