'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { UserRole } from '@/types';
import type { Subject } from '@/types';
import { subjectService } from '@/services/subject.service';
import { Button } from '@/components/ui/Button';
import { CreateSubjectModal } from '@/components/admin/CreateSubjectModal';
import { EditSubjectModal } from '@/components/admin/EditSubjectModal';

export default function MateriasPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.ADMIN] });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta materia?')) return;

    try {
      await subjectService.delete(id);
      loadSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar la materia');
    }
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materias</h1>
          <p className="text-gray-600 mt-2">Gestiona las materias disponibles</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + Nueva Materia
        </Button>
      </div>

      {isLoadingSubjects ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No hay materias registradas</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Crear primera materia
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {subject.name}
                </h3>
                {subject.level && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {subject.level}
                  </span>
                )}
              </div>
              {subject.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {subject.description}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(subject)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(subject.id)}
                  className="flex-1"
                >
                  Eliminar
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateSubjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadSubjects}
      />

      <EditSubjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubject(null);
        }}
        onSuccess={loadSubjects}
        subject={selectedSubject}
      />
    </div>
  );
}
