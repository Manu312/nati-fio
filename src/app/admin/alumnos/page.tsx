'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentService } from '@/services';
import { Student } from '@/types';
import { Loader2, Plus, GraduationCap, Edit, Trash2, Mail, School, User } from 'lucide-react';
import { CreateStudentModal } from '@/components/admin/CreateStudentModal';
import { EditStudentModal } from '@/components/admin/EditStudentModal';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AlumnosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alumnos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setSuccessMessage('Alumno creado exitosamente');
    loadStudents();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditSuccess = () => {
    setSuccessMessage('Alumno actualizado exitosamente');
    loadStudents();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    try {
      setIsDeleting(true);
      await studentService.delete(studentToDelete.id);
      setSuccessMessage('Alumno eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      loadStudents();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar alumno');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStudentName = (student: Student) => {
    const parts = [student.firstName];
    if (student.lastName) parts.push(student.lastName);
    return parts.join(' ');
  };

  const getTutorName = (student: Student) => {
    if (!student.tutorFirstName) return null;
    const parts = [student.tutorFirstName];
    if (student.tutorLastName) parts.push(student.tutorLastName);
    return parts.join(' ');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Alumnos</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Gestiona los alumnos registrados</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nuevo Alumno
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

      {/* Vista móvil - Cards */}
      <div className="lg:hidden space-y-4">
        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay alumnos registrados</p>
          </div>
        ) : (
          students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{getStudentName(student)}</p>
                    {student.grade && (
                      <p className="text-xs text-gray-500">Grado: {student.grade}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3 text-sm text-gray-600">
                {student.school && (
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-gray-400" />
                    <span>{student.school}</span>
                  </div>
                )}
                {student.parentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="break-all">{student.parentEmail}</span>
                  </div>
                )}
                {getTutorName(student) && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Tutor: {getTutorName(student)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditStudent(student)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(student)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Vista desktop - Tabla */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alumno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grado / Escuela
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Padre/Madre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay alumnos registrados</p>
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getStudentName(student)}</p>
                        {student.user?.email && (
                          <p className="text-sm text-gray-500">{student.user.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {student.grade && (
                        <p className="text-gray-900">{student.grade}</p>
                      )}
                      {student.school && (
                        <p className="text-gray-500">{student.school}</p>
                      )}
                      {!student.grade && !student.school && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getTutorName(student) || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.parentEmail || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        student={selectedStudent}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Alumno"
        message={
          <>
            ¿Estás seguro de que deseas eliminar al alumno <strong>{studentToDelete ? getStudentName(studentToDelete) : ''}</strong>?
            <br /><br />
            <span className="text-amber-600 text-sm">
              ⚠️ Esta acción también eliminará todas las reservas asociadas a este alumno.
            </span>
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
