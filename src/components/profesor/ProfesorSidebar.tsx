'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  BookOpen,
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.PROFESOR.HOME },
  { icon: Calendar, label: 'Mis Reservas', href: ROUTES.PROFESOR.MIS_RESERVAS },
  { icon: Clock, label: 'Disponibilidad', href: ROUTES.PROFESOR.DISPONIBILIDAD },
];

export function ProfesorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Naty & Fio</h2>
            <p className="text-xs text-green-600 font-medium">Profesor</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : ''}`} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
