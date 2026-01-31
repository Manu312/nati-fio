import type { Availability, Booking } from '@/types';

/**
 * Valida si una hora está dentro de una franja horaria
 */
export function isTimeInSlot(time: string, startTime: string, endTime: string): boolean {
  return time >= startTime && time < endTime;
}

/**
 * Valida si dos franjas horarias se solapan
 */
export function doTimeSlotsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return (
    (start1 < end2 && end1 > start2) ||
    (start2 < end1 && end2 > start1)
  );
}

/**
 * Obtiene el día de la semana de una fecha (0=Domingo, 1=Lunes, etc.)
 * Parseamos la fecha manualmente para evitar problemas de zona horaria
 */
export function getDayOfWeek(date: string): number {
  // Parsear la fecha como YYYY-MM-DD para evitar problemas de timezone
  // new Date("2026-02-02") se interpreta como UTC y puede dar un día incorrecto
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).getDay();
}

/**
 * Valida si una reserva está dentro de alguna franja de disponibilidad del profesor
 */
export function isBookingWithinAvailability(
  bookingDate: string,
  bookingStartTime: string,
  bookingEndTime: string,
  availabilities: Availability[]
): { valid: boolean; error?: string } {
  const dayOfWeek = getDayOfWeek(bookingDate);
  
  // Filtrar disponibilidades para el día de la reserva
  const dayAvailabilities = availabilities.filter(
    (av) => av.dayOfWeek === dayOfWeek
  );

  if (dayAvailabilities.length === 0) {
    return {
      valid: false,
      error: 'El profesor no tiene disponibilidad configurada para este día',
    };
  }

  // Verificar si la reserva está completamente dentro de alguna franja
  const isWithinAnySlot = dayAvailabilities.some((av) => {
    return (
      bookingStartTime >= av.startTime &&
      bookingEndTime <= av.endTime
    );
  });

  if (!isWithinAnySlot) {
    return {
      valid: false,
      error: 'La reserva debe estar completamente dentro de una franja horaria disponible',
    };
  }

  return { valid: true };
}

/**
 * Valida si una nueva reserva se solapa con reservas existentes
 */
export function doesBookingOverlapWithExisting(
  bookingDate: string,
  bookingStartTime: string,
  bookingEndTime: string,
  existingBookings: Booking[],
  excludeBookingId?: string
): { overlaps: boolean; conflictingBooking?: Booking } {
  // Filtrar reservas del mismo día
  const sameDayBookings = existingBookings.filter((booking) => {
    // Excluir la reserva que estamos editando (si existe)
    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }
    
    return booking.date === bookingDate;
  });

  // Verificar solapamiento
  for (const existing of sameDayBookings) {
    if (doTimeSlotsOverlap(bookingStartTime, bookingEndTime, existing.startTime, existing.endTime)) {
      return {
        overlaps: true,
        conflictingBooking: existing,
      };
    }
  }

  return { overlaps: false };
}

/**
 * Valida completamente una reserva
 */
export function validateBooking(
  bookingDate: string,
  bookingStartTime: string,
  bookingEndTime: string,
  teacherId: string,
  availabilities: Availability[],
  existingBookings: Booking[],
  excludeBookingId?: string
): { valid: boolean; error?: string } {
  // Validar que la hora de fin sea mayor que la de inicio
  if (bookingStartTime >= bookingEndTime) {
    return {
      valid: false,
      error: 'La hora de fin debe ser mayor que la hora de inicio',
    };
  }

  // Validar que esté dentro de la disponibilidad del profesor
  const teacherAvailabilities = availabilities.filter((av) => av.teacherId === teacherId);
  const availabilityCheck = isBookingWithinAvailability(
    bookingDate,
    bookingStartTime,
    bookingEndTime,
    teacherAvailabilities
  );

  if (!availabilityCheck.valid) {
    return availabilityCheck;
  }

  // Validar que no se solape con otras reservas del mismo profesor
  const teacherBookings = existingBookings.filter((b) => b.teacherId === teacherId);
  const overlapCheck = doesBookingOverlapWithExisting(
    bookingDate,
    bookingStartTime,
    bookingEndTime,
    teacherBookings,
    excludeBookingId
  );

  if (overlapCheck.overlaps) {
    return {
      valid: false,
      error: 'Ya existe una reserva en este horario',
    };
  }

  return { valid: true };
}

/**
 * Obtiene las franjas disponibles para un profesor en una fecha específica
 */
export function getAvailableSlots(
  date: string,
  teacherId: string,
  availabilities: Availability[],
  existingBookings: Booking[]
): Array<{ startTime: string; endTime: string; available: boolean }> {
  const dayOfWeek = getDayOfWeek(date);
  
  // Obtener franjas del profesor para ese día
  const dayAvailabilities = availabilities.filter(
    (av) => av.teacherId === teacherId && av.dayOfWeek === dayOfWeek
  );

  if (dayAvailabilities.length === 0) {
    return [];
  }

  // Obtener reservas del profesor en esa fecha
  const dayBookings = existingBookings.filter(
    (booking) => booking.teacherId === teacherId && booking.date === date
  );

  // Marcar cada franja como disponible o no
  return dayAvailabilities.map((slot) => {
    const hasConflict = dayBookings.some((booking) =>
      doTimeSlotsOverlap(slot.startTime, slot.endTime, booking.startTime, booking.endTime)
    );

    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: !hasConflict,
    };
  });
}
