'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.ADMIN.HOME },
  { icon: Users, label: 'Usuarios', href: ROUTES.ADMIN.USUARIOS },
  { icon: GraduationCap, label: 'Profesores', href: ROUTES.ADMIN.PROFESORES },
  { icon: BookOpen, label: 'Materias', href: ROUTES.ADMIN.MATERIAS },
  { icon: Clock, label: 'Disponibilidad', href: ROUTES.ADMIN.DISPONIBILIDAD },
  { icon: Calendar, label: 'Reservas', href: ROUTES.ADMIN.RESERVAS },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Naty & Fio
        </h2>
        <p className="text-sm text-gray-600 mt-1">Panel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
