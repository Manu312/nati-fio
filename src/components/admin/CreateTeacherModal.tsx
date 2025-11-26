'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { teacherService, userService } from '@/services';
import { User, UserRole } from '@/types';
import { validation } from '@/utils/validation';

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTeacherModal({ isOpen, onClose, onSuccess }: CreateTeacherModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAll();
      // Filtrar solo usuarios con rol PROFESOR
      const profesores = allUsers.filter((u) => u.roles.includes(UserRole.PROFESOR));
      setUsers(profesores);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validation.isNotEmpty(firstName) || !validation.isNotEmpty(lastName)) {
      setError('El nombre y apellido son obligatorios');
      return;
    }

    if (!userId) {
      setError('Debe seleccionar un usuario');
      return;
    }

    setIsLoading(true);

    try {
      await teacherService.create({
        userId,
        firstName,
        lastName,
        bio: bio || undefined,
        maxCapacity,
      });

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear profesor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUserId('');
    setFirstName('');
    setLastName('');
    setBio('');
    setMaxCapacity(5);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Profesor" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
            Usuario (Debe tener rol PROFESOR) *
          </label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
          {users.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              No hay usuarios con rol PROFESOR. Crea un usuario con ese rol primero.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Juan"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido *
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pérez"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-2">
            Capacidad Máxima de Alumnos
          </label>
          <input
            id="maxCapacity"
            type="number"
            min="1"
            max="50"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Breve descripción del profesor, experiencia, especialidades..."
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
            disabled={isLoading || users.length === 0}
            className="flex-1"
          >
            Crear Profesor
          </Button>
        </div>
      </form>
    </Modal>
  );
}
