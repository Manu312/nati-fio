'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { userService } from '@/services/user.service';
import { teacherService } from '@/services/teacher.service';
import { bookingService } from '@/services/booking.service';
import { subjectService } from '@/services/subject.service';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const [users, teachers, subjects, bookings] = await Promise.all([
        userService.getAll(),
        teacherService.getAll(),
        subjectService.getAll(),
        bookingService.getAll(),
      ]);

      setStats({
        totalUsers: users.length,
        totalTeachers: teachers.length,
        totalSubjects: subjects.length,
        totalBookings: bookings.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsConfig = [
    { label: 'Usuarios Totales', value: stats.totalUsers, icon: Users, color: 'blue' },
    { label: 'Profesores', value: stats.totalTeachers, icon: GraduationCap, color: 'purple' },
    { label: 'Materias', value: stats.totalSubjects, icon: BookOpen, color: 'green' },
    { label: 'Reservas Activas', value: stats.totalBookings, icon: Calendar, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-1">Bienvenido al sistema de gestión</p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => router.push('/admin/usuarios')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer"
          >
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Usuarios</p>
            <p className="text-sm text-gray-500">Ver y editar usuarios</p>
          </button>
          
          <button 
            onClick={() => router.push('/admin/profesores')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left cursor-pointer"
          >
            <GraduationCap className="w-6 h-6 text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Profesores</p>
            <p className="text-sm text-gray-500">Agregar y editar profesores</p>
          </button>
          
          <button 
            onClick={() => router.push('/admin/materias')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left cursor-pointer"
          >
            <BookOpen className="w-6 h-6 text-green-500 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Materias</p>
            <p className="text-sm text-gray-500">Agregar y editar materias</p>
          </button>
        </div>
      </div>

      {/* Nueva sección: Asignación de Clases */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Asignar Clases</h2>
        <p className="text-gray-600 text-sm mb-4">Gestiona las clases directamente y crea horarios recurrentes</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => router.push('/admin/reservas')}
            className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-left border border-transparent hover:border-blue-300"
          >
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Ver Todas las Reservas</p>
            <p className="text-sm text-gray-500 mt-1">Gestiona el calendario completo</p>
          </button>
          
          <button 
            onClick={() => router.push('/admin/reservas')}
            className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-left border border-transparent hover:border-purple-300"
          >
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Clases Recurrentes</p>
            <p className="text-sm text-gray-500 mt-1">Crea y gestiona horarios mensuales</p>
          </button>
        </div>
      </div>
    </div>
  );
}
