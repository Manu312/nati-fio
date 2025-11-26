'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, GraduationCap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

const quickActions = [
  {
    icon: Calendar,
    title: 'Reservar Clase',
    description: 'Agenda una nueva clase con un profesor',
    href: ROUTES.ALUMNO.RESERVAR,
    color: 'blue',
  },
  {
    icon: Clock,
    title: 'Mis Reservas',
    description: 'Ver y gestionar tus clases programadas',
    href: ROUTES.ALUMNO.MIS_RESERVAS,
    color: 'purple',
  },
];

export default function AlumnoDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-600 mt-1">Bienvenido a tu espacio de aprendizaje</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-${action.color}-200 transition-all cursor-pointer group`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-${action.color}-50 rounded-lg group-hover:bg-${action.color}-100 transition-colors`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Clases</h2>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes clases programadas</p>
          <Link href={ROUTES.ALUMNO.RESERVAR}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reservar Primera Clase
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
