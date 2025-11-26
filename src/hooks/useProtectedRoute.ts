'use client';

/**
 * useProtectedRoute Hook
 * Hook para proteger rutas según autenticación y roles
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import type { UserRole } from '@/types';

interface UseProtectedRouteOptions {
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requiredRoles, redirectTo = '/login' } = options;
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que termine de cargar
    if (isLoading) return;

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Si se requieren roles específicos, verificar
    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasAnyRole(requiredRoles)) {
        // Si no tiene los roles necesarios, redirigir a home o página de acceso denegado
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, requiredRoles, hasAnyRole, router, redirectTo, user]);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}
