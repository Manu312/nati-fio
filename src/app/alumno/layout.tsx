'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types';
import { AlumnoSidebar } from '@/components/alumno/AlumnoSidebar';
import { AlumnoHeader } from '@/components/alumno/AlumnoHeader';

interface AlumnoLayoutProps {
  children: ReactNode;
}

export default function AlumnoLayout({ children }: AlumnoLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ALUMNO]}>
      <div className="flex h-screen bg-gray-50">
        <AlumnoSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AlumnoHeader />
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
