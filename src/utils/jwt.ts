/**
 * JWT Utilities - Funciones para trabajar con JSON Web Tokens de forma segura
 */

/**
 * Decodifica un JWT sin usar atob() (más seguro para CSP)
 * @param token - JWT completo (header.payload.signature)
 * @returns Payload decodificado
 */
export function decodeJWT<T = any>(token: string): T {
  try {
    // Extraer la parte del payload (segunda parte)
    const base64Url = token.split('.')[1];
    
    if (!base64Url) {
      throw new Error('Token JWT inválido');
    }

    // Convertir de base64url a base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificar usando TextDecoder (no requiere eval)
    const jsonPayload = decodeURIComponent(
      base64
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    throw new Error('No se pudo decodificar el token JWT');
  }
}

/**
 * Valida si un JWT está expirado
 * @param token - JWT completo
 * @returns true si está expirado, false si aún es válido
 */
export function isJWTExpired(token: string): boolean {
  try {
    const payload = decodeJWT<{ exp?: number }>(token);
    
    if (!payload.exp) {
      return false; // Si no tiene exp, asumimos que no expira
    }

    // exp viene en segundos, Date.now() en milisegundos
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // Si hay error al decodificar, considerarlo expirado
  }
}

/**
 * Extrae el tiempo de expiración de un JWT
 * @param token - JWT completo
 * @returns Fecha de expiración o null si no tiene
 */
export function getJWTExpiration(token: string): Date | null {
  try {
    const payload = decodeJWT<{ exp?: number }>(token);
    
    if (!payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
}
