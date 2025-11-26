'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teacherService } from '@/services';
import { Teacher } from '@/types';
import { Loader2, GraduationCap, Calendar } from 'lucide-react';
import { CreateBookingModal } from '@/components/alumno/CreateBookingModal';
import { Alert } from '@/components/ui/Alert';

export default function ReservarPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar profesores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setSuccessMessage('¡Reserva creada exitosamente!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleBookTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reservar Clase</h1>
        <p className="text-gray-600 mt-1">Selecciona un profesor y agenda tu clase</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay profesores disponibles en este momento</p>
          </div>
        ) : (
          teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900">
                {teacher.firstName} {teacher.lastName}
              </h3>
              
              {teacher.bio && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{teacher.bio}</p>
              )}
              
              {teacher.subjects && teacher.subjects.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {teacher.subjects.map((subject) => (
                    <span
                      key={subject.id}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium"
                    >
                      {subject.name}
                    </span>
                  ))}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBookTeacher(teacher)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                Reservar Clase
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <CreateBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
        teacher={selectedTeacher}
      />
    </div>
  );
}
