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
import { ConfirmDialog } from '@/components/ui';
import { useConfirm } from '@/hooks';

// Mapeo de niveles para mostrar de forma legible
const levelLabels: Record<string, { label: string; className: string }> = {
  primaria: { label: 'Primario', className: 'bg-green-100 text-green-700' },
  secundaria: { label: 'Secundario', className: 'bg-blue-100 text-blue-700' },
  universitaria: { label: 'Universitario', className: 'bg-purple-100 text-purple-700' },
};

export default function MateriasPage() {
  const { isLoading } = useProtectedRoute({ requiredRoles: [UserRole.ADMIN] });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [error, setError] = useState('');
  const { confirm, confirmProps } = useConfirm();

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
    const ok = await confirm({
      title: 'Eliminar materia',
      message: '¿Estás seguro de eliminar esta materia? Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await subjectService.delete(id);
      loadSubjects();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar la materia');
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {subject.name}
                </h3>
                {subject.level && levelLabels[subject.level] && (
                  <span className={`px-2 py-1 text-xs font-medium rounded ${levelLabels[subject.level].className}`}>
                    {levelLabels[subject.level].label}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
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

      <ConfirmDialog {...confirmProps} />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
