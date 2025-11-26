'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, BookOpen } from 'lucide-react';
import { teacherService, subjectService } from '@/services';
import type { Teacher, UpdateTeacherDto, Subject } from '@/types';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacher: Teacher;
}

export function EditTeacherModal({ isOpen, onClose, onSuccess, teacher }: EditTeacherModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UpdateTeacherDto>({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    bio: teacher.bio || '',
    maxCapacity: teacher.maxCapacity,
    subjectIds: teacher.subjects?.map(s => s.id.toString()) || [],
  });

  useEffect(() => {
    if (isOpen) {
      loadSubjects();
      // Reset form con datos del profesor
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        bio: teacher.bio || '',
        maxCapacity: teacher.maxCapacity,
        subjectIds: teacher.subjects?.map(s => s.id.toString()) || [],
      });
      setError('');
    }
  }, [isOpen, teacher]);

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      setError('Error al cargar materias');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      await teacherService.update(teacher.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar profesor');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubject = (subjectId: number) => {
    const idStr = subjectId.toString();
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds?.includes(idStr)
        ? prev.subjectIds.filter((id: string) => id !== idStr)
        : [...(prev.subjectIds || []), idStr]
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Editar Profesor</h2>
                <p className="text-sm text-gray-500">Actualiza la información del profesor</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>

            {/* Biografía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Breve descripción del profesor..."
              />
            </div>

            {/* Capacidad máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad Máxima de Alumnos *
              </label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Materias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <BookOpen className="inline w-4 h-4 mr-2" />
                Materias que enseña
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                {subjects.length === 0 ? (
                  <p className="col-span-2 text-gray-500 text-sm text-center py-4">
                    No hay materias disponibles
                  </p>
                ) : (
                  subjects.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subjectIds?.includes(subject.id.toString()) || false}
                        onChange={() => toggleSubject(subject.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{subject.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
