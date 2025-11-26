'use client';

import { ReactNode } from 'react';
import { ProfesorSidebar } from '@/components/profesor/ProfesorSidebar';
import { ProfesorHeader } from '@/components/profesor/ProfesorHeader';

interface ProfesorLayoutProps {
  children: ReactNode;
}

export default function ProfesorLayout({ children }: ProfesorLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <ProfesorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfesorHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
