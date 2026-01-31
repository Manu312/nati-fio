'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types';
import { LoginForm } from '@/components/auth/LoginForm';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Si tiene múltiples roles, mostrar selector
      if (user.roles.length > 1) {
        setShowRoleSelector(true);
        return;
      }
      
      // Si solo tiene un rol, redirigir directamente
      const role = user.roles[0];
      
      if (role === UserRole.ADMIN) {
        router.push('/admin');
      } else if (role === UserRole.PROFESOR) {
        router.push('/profesor');
      } else if (role === UserRole.ALUMNO) {
        router.push('/alumno');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mostrar selector de roles si tiene múltiples roles
  if (isAuthenticated && user && showRoleSelector) {
    return <RoleSelector roles={user.roles} onSelectRole={() => {}} />;
  }

  if (isAuthenticated) {
    return null; // Se está redirigiendo
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Naty & Fio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-2"
          >
            Plataforma educativa de alto rendimiento
          </motion.p>
        </div>

        <LoginForm />
      </motion.div>
    </div>
  );
}
