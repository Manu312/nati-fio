'use client';

import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Shield, Menu } from 'lucide-react';
import { PanelSwitcher } from '@/components/ui/PanelSwitcher';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Botón menú móvil */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Panel Admin</h1>
              <p className="text-xs text-gray-500">Gestión del sistema</p>
            </div>
          </div>
          {user?.roles && user.roles.length > 1 && (
            <div className="hidden md:block">
              <PanelSwitcher roles={user.roles} currentPanel="admin" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-purple-700">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-700 max-w-[150px] truncate hidden md:inline">{user?.email}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Salir</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
