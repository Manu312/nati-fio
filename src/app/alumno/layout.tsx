'use client';

import { ReactNode, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types';
import { AlumnoSidebar } from '@/components/alumno/AlumnoSidebar';
import { AlumnoHeader } from '@/components/alumno/AlumnoHeader';
import { MobileMenu } from '@/components/ui/MobileMenu';

interface AlumnoLayoutProps {
  children: ReactNode;
}

export default function AlumnoLayout({ children }: AlumnoLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute requiredRoles={[UserRole.ALUMNO]}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar desktop */}
        <div className="hidden lg:block">
          <AlumnoSidebar />
        </div>

        {/* Menú móvil */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <AlumnoSidebar />
        </MobileMenu>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AlumnoHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
