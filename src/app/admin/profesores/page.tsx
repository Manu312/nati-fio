'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teacherService } from '@/services';
import { Teacher } from '@/types';
import { Loader2, Plus, GraduationCap, Trash2, Edit, Search, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { CreateTeacherModal } from '@/components/admin/CreateTeacherModal';
import { EditTeacherModal } from '@/components/admin/EditTeacherModal';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui';
import { useConfirm } from '@/hooks';

export default function ProfesoresPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { confirm, confirmProps } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'maxCapacity'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filteredTeachers = useMemo(() => {
    let result = [...teachers];
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t =>
        (`${t.firstName} ${t.lastName}`).toLowerCase().includes(lower) ||
        (t.subjects?.some(s => s.name.toLowerCase().includes(lower)) ?? false)
      );
    }
    result.sort((a, b) => {
      if (sortField === 'name') {
        const valA = `${a.firstName} ${a.lastName}`;
        const valB = `${b.firstName} ${b.lastName}`;
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        const diff = (a.maxCapacity ?? 0) - (b.maxCapacity ?? 0);
        return sortDir === 'asc' ? diff : -diff;
      }
    });
    return result;
  }, [teachers, searchTerm, sortField, sortDir]);

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
    const ok = await confirm({
      title: 'Eliminar profesor',
      message: `¿Estás seguro de que quieres eliminar a ${name}? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      variant: 'danger',
    });
    if (!ok) return;

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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o materia..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(['name', 'maxCapacity'] as const).map(field => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                sortField === field ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {field === 'name' ? 'Nombre' : 'Capacidad'}
              {sortField === field ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
            </button>
          ))}
        </div>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-500">
          {filteredTeachers.length} resultado{filteredTeachers.length !== 1 ? 's' : ''} de {teachers.length}
        </p>
      )}

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
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{searchTerm ? 'Sin resultados para la búsqueda' : 'No hay profesores registrados'}</p>
          </div>
        ) : (
          filteredTeachers.map((teacher, index) => (
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

      <ConfirmDialog {...confirmProps} />
    </div>
  );
}
