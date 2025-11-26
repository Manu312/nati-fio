'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { userService } from '@/services';
import { User, UserRole } from '@/types';

interface EditUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export function EditUserRolesModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: EditUserRolesModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return;
    if (selectedRoles.length === 0) {
      setError('Debe seleccionar al menos un rol');
      return;
    }

    setIsLoading(true);

    try {
      await userService.updateRoles(user.id, { roles: selectedRoles });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Roles de Usuario">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Usuario</p>
          <p className="text-lg font-semibold text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Roles del Usuario
          </label>
          <div className="space-y-3">
            {Object.values(UserRole).map((role) => (
              <label
                key={role}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{role}</span>
                  <p className="text-xs text-gray-500">
                    {role === UserRole.ADMIN && 'Acceso completo al sistema'}
                    {role === UserRole.PROFESOR && 'Puede gestionar clases y alumnos'}
                    {role === UserRole.ALUMNO && 'Puede reservar y ver clases'}
                  </p>
                </div>
              </label>
            ))}
          </div>
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
            disabled={isLoading || selectedRoles.length === 0}
            className="flex-1"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
