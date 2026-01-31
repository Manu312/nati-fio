'use client';

/**
 * Auth Context - Contexto de Autenticación
 * Provee el estado de autenticación a toda la aplicación
 */

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { decodeJWT } from '@/utils/jwt';
import type {
  AuthState,
  LoginCredentials,
  User,
} from '@/types';
import { UserRole } from '@/types/auth';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * Inicializar estado desde localStorage al montar
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            setState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            setState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.login(credentials);
      
      console.log('🔐 AuthContext - Respuesta completa de login:', response);
      console.log('🔐 AuthContext - Usuario:', response.user);
      
      // Si el backend NO devuelve user, decodificar el JWT
      let user: User;
      
      if (!response.user) {
        console.log('⚠️ Backend no devuelve user, decodificando JWT...');
        
        try {
          // Decodificar el JWT para obtener los datos del usuario (sin atob - CSP safe)
          const payload = decodeJWT<{
            sub?: string;
            id?: string;
            userId?: string;
            email?: string;
            roles?: string[];
            role?: string;
          }>(response.access_token);
          
          console.log('📦 Payload del JWT:', payload);
          
          // Normalizar roles del payload
          let roles: UserRole[];
          if (payload.roles && Array.isArray(payload.roles)) {
            roles = payload.roles as UserRole[];
          } else if (payload.role) {
            roles = [payload.role as UserRole];
          } else {
            roles = [UserRole.ALUMNO];
          }
          
          user = {
            id: payload.sub || payload.id || payload.userId || '',
            email: payload.email || credentials.email,
            roles,
          };
          
          console.log('✅ Usuario construido desde JWT:', user);
        } catch (decodeError) {
          console.error('❌ Error decodificando JWT:', decodeError);
          throw new Error('No se pudo obtener información del usuario');
        }
      } else {
        user = response.user;
      }
      
      // Normalizar roles
      if (!user.roles || user.roles.length === 0) {
        console.log('⚠️ Usuario sin roles, intentando normalizar...');
        
        // Opción 1: Puede que venga en singular "role"
        if ((user as any).role) {
          const roleStr = ((user as any).role as string).toUpperCase();
          user.roles = [roleStr as UserRole];
          console.log('✅ Rol encontrado en .role:', user.roles);
        }
        // Opción 2: Puede que venga en un array de objetos
        else if (Array.isArray((user as any).roles) && 
                 (user as any).roles.length > 0 &&
                 typeof (user as any).roles[0] === 'object') {
          user.roles = (user as any).roles.map((r: any) => 
            ((r.name || r.role) as string).toUpperCase() as UserRole
          );
          console.log('✅ Roles encontrados como objetos:', user.roles);
        }
        // Opción 3: Usuario sin roles definidos - asignar ALUMNO por defecto
        else {
          console.log('⚠️ No se encontraron roles, asignando ALUMNO por defecto');
          user.roles = [UserRole.ALUMNO];
        }
      } else {
        // Normalizar roles existentes a mayúsculas
        user.roles = user.roles.map(role => 
          (typeof role === 'string' ? role.toUpperCase() : role) as UserRole
        );
      }
      
      console.log('🔐 AuthContext - Roles normalizados:', user.roles);

      // Guardar usuario y token en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        console.log('💾 Usuario y token guardados en localStorage');
      }

      setState({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ AuthContext - Error en login:', error);
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      console.log('🗑️ localStorage limpiado');
    }
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  /**
   * Verificar si tiene un rol específico
   */
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return state.user?.roles?.includes(role) ?? false;
    },
    [state.user]
  );

  /**
   * Verificar si tiene alguno de los roles
   */
  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!state.user?.roles) return false;
      return roles.some((role) => state.user?.roles.includes(role));
    },
    [state.user]
  );

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
