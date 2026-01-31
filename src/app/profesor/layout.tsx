'use client';

import { ReactNode, useState } from 'react';
import { ProfesorSidebar } from '@/components/profesor/ProfesorSidebar';
import { ProfesorHeader } from '@/components/profesor/ProfesorHeader';
import { MobileMenu } from '@/components/ui/MobileMenu';

interface ProfesorLayoutProps {
  children: ReactNode;
}

export default function ProfesorLayout({ children }: ProfesorLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <ProfesorSidebar />
      </div>

      {/* Menú móvil */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <ProfesorSidebar />
      </MobileMenu>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfesorHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
