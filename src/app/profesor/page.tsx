'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

export default function ProfesorDashboard() {
  const { isLoading, user } = useProtectedRoute({ requiredRoles: [UserRole.PROFESOR] });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Reservas Hoy', value: '0', icon: Calendar, color: 'blue' },
    { label: 'Esta Semana', value: '0', icon: Clock, color: 'purple' },
    { label: 'Alumnos Activos', value: '0', icon: Users, color: 'green' },
    { label: 'Completadas', value: '0', icon: CheckCircle, color: 'orange' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, Profesor
        </h1>
        <p className="text-gray-600 mt-2">
          Panel de control para gestionar tus clases y disponibilidad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Próximas Clases
          </h3>
          <div className="text-center py-8 text-gray-500">
            No tienes clases programadas
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Tu Disponibilidad
          </h3>
          <div className="text-center py-8 text-gray-500">
            Configura tu disponibilidad horaria
          </div>
        </motion.div>
      </div>
    </div>
  );
}
