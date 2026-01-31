'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { studentService } from '@/services';
import { Student, UpdateStudentDto } from '@/types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Student | null;
}

export function EditStudentModal({ isOpen, onClose, onSuccess, student }: EditStudentModalProps) {
  const [formData, setFormData] = useState<UpdateStudentDto>({
    firstName: '',
    lastName: '',
    parentEmail: '',
    tutorFirstName: '',
    tutorLastName: '',
    grade: '',
    school: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName || '',
        parentEmail: student.parentEmail || '',
        tutorFirstName: student.tutorFirstName || '',
        tutorLastName: student.tutorLastName || '',
        grade: student.grade || '',
        school: student.school || '',
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setError('');

    if (!formData.firstName?.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para enviar
      const dataToSend: UpdateStudentDto = {
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim() || undefined,
        parentEmail: formData.parentEmail?.trim() || undefined,
        tutorFirstName: formData.tutorFirstName?.trim() || undefined,
        tutorLastName: formData.tutorLastName?.trim() || undefined,
        grade: formData.grade?.trim() || undefined,
        school: formData.school?.trim() || undefined,
      };

      await studentService.update(student.id, dataToSend);
      
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar alumno');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      parentEmail: '',
      tutorFirstName: '',
      tutorLastName: '',
      grade: '',
      school: '',
    });
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Alumno">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del alumno"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apellido del alumno"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              Grado / Curso
            </label>
            <input
              id="grade"
              name="grade"
              type="text"
              value={formData.grade || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 5to año"
            />
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
              Escuela / Colegio
            </label>
            <input
              id="school"
              name="school"
              type="text"
              value={formData.school || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del colegio"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        <p className="text-sm text-gray-500 font-medium">Información del Tutor (opcional)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tutorFirstName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Tutor
            </label>
            <input
              id="tutorFirstName"
              name="tutorFirstName"
              type="text"
              value={formData.tutorFirstName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del padre/madre/tutor"
            />
          </div>

          <div>
            <label htmlFor="tutorLastName" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido del Tutor
            </label>
            <input
              id="tutorLastName"
              name="tutorLastName"
              type="text"
              value={formData.tutorLastName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apellido del tutor"
            />
          </div>
        </div>

        <div>
          <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email del Padre/Madre
          </label>
          <input
            id="parentEmail"
            name="parentEmail"
            type="email"
            value={formData.parentEmail || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="padre@ejemplo.com"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
