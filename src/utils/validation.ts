/**
 * Validation Utilities
 * Funciones de validación reutilizables
 */

export const validation = {
  /**
   * Valida formato de email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida longitud mínima de contraseña
   */
  isValidPassword(password: string, minLength: number = 6): boolean {
    return password.length >= minLength;
  },

  /**
   * Valida formato de hora HH:mm
   */
  isValidTime(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },

  /**
   * Valida que endTime sea posterior a startTime
   */
  isValidTimeRange(startTime: string, endTime: string): boolean {
    if (!this.isValidTime(startTime) || !this.isValidTime(endTime)) {
      return false;
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes > startMinutes;
  },

  /**
   * Valida que una fecha sea futura
   */
  isFutureDate(date: string): boolean {
    const inputDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return inputDate >= now;
  },

  /**
   * Valida que un string no esté vacío
   */
  isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  },

  /**
   * Valida que un número esté dentro de un rango
   */
  isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },
};
