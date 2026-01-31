'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PanelSwitcher } from '@/components/ui/PanelSwitcher';

export function ProfesorHeader() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Gestión de Clases
            </h2>
            <p className="text-sm text-gray-500">
              Administra tu horario y reservas
            </p>
          </div>
          {user?.roles && user.roles.length > 1 && (
            <PanelSwitcher roles={user.roles} currentPanel="profesor" />
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">{user?.email}</div>
              <div className="text-xs text-gray-500">Profesor</div>
            </div>
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 transition-colors">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Mi Perfil</span>
                </button>
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Configuración</span>
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
