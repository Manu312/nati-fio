'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { Shield, GraduationCap, BookOpen } from 'lucide-react';

interface RoleSelectorProps {
  roles: UserRole[];
  onSelectRole: (path: string) => void;
}

export function RoleSelector({ roles, onSelectRole }: RoleSelectorProps) {
  const router = useRouter();

  const roleConfig = {
    [UserRole.ADMIN]: {
      icon: Shield,
      label: 'Administrador',
      description: 'Gestiona usuarios, profesores y materias',
      path: '/admin',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    [UserRole.PROFESOR]: {
      icon: GraduationCap,
      label: 'Profesor',
      description: 'Gestiona tus clases y horarios',
      path: '/profesor',
      gradient: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    [UserRole.ALUMNO]: {
      icon: BookOpen,
      label: 'Alumno',
      description: 'Reserva clases y ve tu progreso',
      path: '/alumno',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  };

  const handleSelectRole = (path: string) => {
    onSelectRole(path);
    router.push(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selecciona tu Rol
          </h2>
          <p className="text-gray-600">
            Tienes acceso a múltiples paneles. ¿A cuál deseas ingresar?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, index) => {
            const config = roleConfig[role];
            if (!config) return null;

            const Icon = config.icon;

            return (
              <motion.button
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectRole(config.path)}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 text-left group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-16 h-16 ${config.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${config.iconColor}`} />
                </div>

                <h3 className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-2`}>
                  {config.label}
                </h3>

                <p className="text-gray-600">
                  {config.description}
                </p>

                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  Ir al panel
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Puedes cambiar de panel en cualquier momento desde el menú de usuario
          </p>
        </div>
      </motion.div>
    </div>
  );
}
