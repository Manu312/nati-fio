'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { userService } from '@/services/user.service';
import { teacherService } from '@/services/teacher.service';
import { bookingService } from '@/services/booking.service';
import { subjectService } from '@/services/subject.service';

export default function AdminDashboard() {
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
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Usuarios</p>
            <p className="text-sm text-gray-500">Ver y editar usuarios</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
            <GraduationCap className="w-6 h-6 text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Profesores</p>
            <p className="text-sm text-gray-500">Agregar y editar profesores</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
            <BookOpen className="w-6 h-6 text-green-500 mb-2" />
            <p className="font-medium text-gray-900">Gestionar Materias</p>
            <p className="text-sm text-gray-500">Agregar y editar materias</p>
          </button>
        </div>
      </div>
    </div>
  );
}
