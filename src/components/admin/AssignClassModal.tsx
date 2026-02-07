'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { TimeSelect } from '@/components/ui';
import { bookingService, studentService, teacherService, subjectService } from '@/services';
import { Student, Teacher, Subject, AdminAssignBookingDto } from '@/types';
import { Search } from 'lucide-react';

interface AssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignClassModal({ isOpen, onClose, onSuccess }: AssignClassModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  const [formData, setFormData] = useState<AdminAssignBookingDto>({
    studentId: '',
    teacherId: '',
    subjectId: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = students.filter(
        (student) =>
          `${student.firstName} ${student.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      const [studentsData, teachersData, subjectsData] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        subjectService.getAll(),
      ]);
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setTeachers(teachersData);
      setSubjects(subjectsData);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.studentId || !formData.teacherId || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Todos los campos obligatorios deben ser completados');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend: AdminAssignBookingDto = {
        studentId: formData.studentId,
        teacherId: formData.teacherId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      if (formData.subjectId) {
        dataToSend.subjectId = formData.subjectId;
      }

      await bookingService.adminAssign(dataToSend);
      
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar clase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
      teacherId: '',
      subjectId: '',
      date: '',
      startTime: '',
      endTime: '',
    });
    setSearchTerm('');
    setError('');
    onClose();
  };

  const selectedStudent = students.find((s) => s.id === formData.studentId);
  const selectedTeacher = teachers.find((t) => t.id === formData.teacherId);
  const selectedSubject = subjects.find((s) => s.id.toString() === formData.subjectId);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Asignar Clase a Alumno" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {isLoadingData ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Búsqueda de alumno */}
            <div>
              <label htmlFor="searchStudent" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Alumno <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="searchStudent"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Buscar por nombre o email..."
                />
              </div>
            </div>

            {/* Selector de alumno */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Alumno <span className="text-red-500">*</span>
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar alumno...</option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.user?.email}
                  </option>
                ))}
              </select>
              {filteredStudents.length === 0 && searchTerm && (
                <p className="text-sm text-amber-600 mt-1">No se encontraron alumnos con ese criterio</p>
              )}
            </div>

            {/* Profesor */}
            <div>
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-2">
                Profesor <span className="text-red-500">*</span>
              </label>
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar profesor...</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Materia (opcional) */}
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-2">
                Materia (opcional)
              </label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin materia específica</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Fecha */}
              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Hora inicio */}
              <div className="sm:col-span-1">
                <TimeSelect
                  label="Hora Inicio *"
                  required
                  value={formData.startTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                />
              </div>

              {/* Hora fin */}
              <div className="sm:col-span-1">
                <TimeSelect
                  label="Hora Fin *"
                  required
                  value={formData.endTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
                  minTime={formData.startTime}
                />
              </div>
            </div>

            {/* Resumen */}
            {(selectedStudent || selectedTeacher || selectedSubject) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Resumen de la clase:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {selectedStudent && (
                    <li>
                      <span className="font-medium">Alumno:</span> {selectedStudent.firstName}{' '}
                      {selectedStudent.lastName}
                    </li>
                  )}
                  {selectedTeacher && (
                    <li>
                      <span className="font-medium">Profesor:</span> {selectedTeacher.firstName}{' '}
                      {selectedTeacher.lastName}
                    </li>
                  )}
                  {selectedSubject && (
                    <li>
                      <span className="font-medium">Materia:</span> {selectedSubject.name}
                    </li>
                  )}
                  {formData.date && (
                    <li>
                      <span className="font-medium">Fecha:</span>{' '}
                      {new Date(formData.date + 'T00:00:00').toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </li>
                  )}
                  {formData.startTime && formData.endTime && (
                    <li>
                      <span className="font-medium">Horario:</span> {formData.startTime} - {formData.endTime}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoadingData}>
            Asignar Clase
          </Button>
        </div>
      </form>
    </Modal>
  );
}
