'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { studentService, userService } from '@/services';
import { CreateStudentDto, User, UserRole } from '@/types';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateStudentModal({ isOpen, onClose, onSuccess }: CreateStudentModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    parentEmail: '',
    tutorFirstName: '',
    tutorLastName: '',
    grade: '',
    school: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const allUsers = await userService.getAll();
      // Filtrar solo usuarios con rol ALUMNO
      const alumnos = allUsers.filter((u) => u.roles.includes(UserRole.ALUMNO));
      setUsers(alumnos);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleUserChange = (selectedUserId: string) => {
    setUserId(selectedUserId);
    
    // Precargar nombre del email
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (selectedUser) {
      const emailParts = selectedUser.email.split('@')[0];
      if (emailParts.includes('.')) {
        const [name, surname] = emailParts.split('.');
        setFormData(prev => ({
          ...prev,
          firstName: capitalizeFirst(name),
          lastName: capitalizeFirst(surname),
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          firstName: capitalizeFirst(emailParts),
          lastName: '',
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId) {
      setError('Debe seleccionar un usuario');
      return;
    }

    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend: CreateStudentDto = {
        userId,
        firstName: formData.firstName.trim(),
      };

      if (formData.lastName?.trim()) dataToSend.lastName = formData.lastName.trim();
      if (formData.parentEmail?.trim()) dataToSend.parentEmail = formData.parentEmail.trim();
      if (formData.tutorFirstName?.trim()) dataToSend.tutorFirstName = formData.tutorFirstName.trim();
      if (formData.tutorLastName?.trim()) dataToSend.tutorLastName = formData.tutorLastName.trim();
      if (formData.grade?.trim()) dataToSend.grade = formData.grade.trim();
      if (formData.school?.trim()) dataToSend.school = formData.school.trim();

      await studentService.create(dataToSend);
      
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear alumno');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUserId('');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Alumno" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
            Usuario (con rol ALUMNO) <span className="text-red-500">*</span>
          </label>
          {isLoadingUsers ? (
            <div className="w-full px-4 py-2 text-gray-500 bg-gray-50 border border-gray-300 rounded-lg">
              Cargando usuarios...
            </div>
          ) : (
            <select
              id="userId"
              value={userId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar usuario...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          )}
          {!isLoadingUsers && users.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              No hay usuarios con rol ALUMNO. Crea un usuario con ese rol primero.
            </p>
          )}
        </div>

        <hr className="border-gray-200" />

        <p className="text-sm text-gray-500 font-medium">Datos del Alumno</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.grade}
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
              value={formData.school}
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
              value={formData.tutorFirstName}
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
              value={formData.tutorLastName}
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
            value={formData.parentEmail}
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
            Crear Alumno
          </Button>
        </div>
      </form>
    </Modal>
  );
}
