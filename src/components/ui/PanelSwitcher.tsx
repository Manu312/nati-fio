'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, GraduationCap, BookOpen } from 'lucide-react';
import { UserRole } from '@/types';

interface PanelSwitcherProps {
  roles: UserRole[];
  currentPanel: 'admin' | 'profesor' | 'alumno';
}

const PANEL_CONFIG = {
  [UserRole.ADMIN]: {
    label: 'Administrador',
    shortLabel: 'Admin',
    path: '/admin',
    icon: Shield,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  [UserRole.PROFESOR]: {
    label: 'Profesor',
    shortLabel: 'Profesor',
    path: '/profesor',
    icon: BookOpen,
    color: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  [UserRole.ALUMNO]: {
    label: 'Alumno',
    shortLabel: 'Alumno',
    path: '/alumno',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
};

export function PanelSwitcher({ roles, currentPanel }: PanelSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Determinar el rol actual basado en el panel
  const currentRole = currentPanel === 'admin' 
    ? UserRole.ADMIN 
    : currentPanel === 'profesor' 
      ? UserRole.PROFESOR 
      : UserRole.ALUMNO;

  const currentConfig = PANEL_CONFIG[currentRole];
  const CurrentIcon = currentConfig.icon;

  // Filtrar roles disponibles (excluyendo el actual)
  const availableRoles = roles.filter(role => role !== currentRole);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (role: UserRole) => {
    const config = PANEL_CONFIG[role];
    router.push(config.path);
    setIsOpen(false);
  };

  // Si solo tiene un rol, no mostrar el switcher
  if (roles.length <= 1) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentConfig.bgColor}`}>
        <CurrentIcon className={`w-4 h-4 ${currentConfig.textColor}`} />
        <span className={`text-sm font-medium ${currentConfig.textColor}`}>
          {currentConfig.shortLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentConfig.bgColor} hover:opacity-90 transition-opacity`}
      >
        <CurrentIcon className={`w-4 h-4 ${currentConfig.textColor}`} />
        <span className={`text-sm font-medium ${currentConfig.textColor}`}>
          {currentConfig.shortLabel}
        </span>
        <ChevronDown className={`w-4 h-4 ${currentConfig.textColor} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase">
              Cambiar a
            </div>
            {availableRoles.map((role) => {
              const config = PANEL_CONFIG[role];
              const Icon = config.icon;
              return (
                <button
                  key={role}
                  onClick={() => handleSwitch(role)}
                  className="w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{config.label}</div>
                    <div className="text-xs text-gray-500">Panel de {config.shortLabel.toLowerCase()}</div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
