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
  Shield,
  UserCheck,
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.ADMIN.HOME },
  { icon: Users, label: 'Usuarios', href: ROUTES.ADMIN.USUARIOS },
  { icon: UserCheck, label: 'Alumnos', href: ROUTES.ADMIN.ALUMNOS },
  { icon: GraduationCap, label: 'Profesores', href: ROUTES.ADMIN.PROFESORES },
  { icon: BookOpen, label: 'Materias', href: ROUTES.ADMIN.MATERIAS },
  { icon: Clock, label: 'Disponibilidad', href: ROUTES.ADMIN.DISPONIBILIDAD },
  { icon: Calendar, label: 'Reservas', href: ROUTES.ADMIN.RESERVAS },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Naty & Fio</h2>
            <p className="text-xs text-purple-600 font-medium">Administración</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
