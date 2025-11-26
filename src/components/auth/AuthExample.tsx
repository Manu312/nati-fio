'use client';

/**
 * Ejemplo de uso de autenticación
 * Este componente muestra cómo usar el sistema de auth
 */

import { useState } from 'react';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types';

export function AuthExample() {
  const { user, isAuthenticated, isLoading, login, logout, hasRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      // Login exitoso - el usuario será redirigido automáticamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Cargando autenticación...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">¡Sesión Iniciada!</h2>
        
        <div className="space-y-2 mb-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
        </div>

        <div className="space-y-2 mb-4">
          <h3 className="font-semibold">Permisos:</h3>
          <ul className="list-disc list-inside">
            <li>Es Admin: {hasRole(UserRole.ADMIN) ? '✅' : '❌'}</li>
            <li>Es Profesor: {hasRole(UserRole.PROFESOR) ? '✅' : '❌'}</li>
            <li>Es Alumno: {hasRole(UserRole.ALUMNO) ? '✅' : '❌'}</li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-2">Nota de desarrollo:</p>
        <p>Este es un componente de ejemplo. En producción, esto debería estar en una página dedicada de login.</p>
      </div>
    </div>
  );
}
