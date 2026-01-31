'use client';

import { ReactNode, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MobileMenu } from '@/components/ui/MobileMenu';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar desktop */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Menú móvil */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <AdminSidebar />
        </MobileMenu>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
