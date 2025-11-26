'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teacherService } from '@/services';
import { Teacher } from '@/types';
import { Loader2, Plus, GraduationCap, Trash2, Edit } from 'lucide-react';
import { CreateTeacherModal } from '@/components/admin/CreateTeacherModal';
import { EditTeacherModal } from '@/components/admin/EditTeacherModal';
import { Alert } from '@/components/ui/Alert';

export default function ProfesoresPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

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

  const handleCreateSuccess = () => {
    setSuccessMessage('Profesor creado exitosamente');
    loadTeachers();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditSuccess = () => {
    setSuccessMessage('Profesor actualizado exitosamente');
    setEditingTeacher(null);
    loadTeachers();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${name}?`)) return;

    try {
      await teacherService.delete(id);
      setSuccessMessage('Profesor eliminado exitosamente');
      loadTeachers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar profesor');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profesores</h1>
          <p className="text-gray-600 mt-1">Gestiona los profesores del sistema</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Nuevo Profesor
        </motion.button>
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
            <p className="text-gray-500">No hay profesores registrados</p>
          </div>
        ) : (
          teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Cap: {teacher.maxCapacity}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900">
                {teacher.firstName} {teacher.lastName}
              </h3>
              
              {teacher.bio && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{teacher.bio}</p>
              )}
              
              {teacher.subjects && teacher.subjects.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {teacher.subjects.map((subject) => (
                    <span
                      key={subject.id}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {subject.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => setEditingTeacher(teacher)}
                  className="flex-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
                  className="flex-1 text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Eliminar
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateTeacherModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      
      {editingTeacher && (
        <EditTeacherModal
          isOpen={true}
          onClose={() => setEditingTeacher(null)}
          onSuccess={handleEditSuccess}
          teacher={editingTeacher}
        />
      )}
    </div>
  );
}
