'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/profesor' },
  { icon: Calendar, label: 'Mis Reservas', href: '/profesor/mis-reservas' },
  { icon: Clock, label: 'Disponibilidad', href: '/profesor/disponibilidad' },
];

export function ProfesorSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-b from-green-600 to-teal-700 text-white flex flex-col shadow-xl"
    >
      <div className="p-6 flex items-center justify-between border-b border-green-500">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold">Panel Profesor</h2>
            <p className="text-green-100 text-sm">Gestión de Clases</p>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-green-500 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-green-600 shadow-md'
                    : 'hover:bg-green-500 text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-green-500">
          <div className="bg-green-500 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">💡 Tip del día</p>
            <p className="text-green-100">
              Mantén tu disponibilidad actualizada para recibir más reservas
            </p>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
