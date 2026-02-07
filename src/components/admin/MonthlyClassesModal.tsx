'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { TimeSelect } from '@/components/ui';
import { bookingService, studentService, teacherService, subjectService } from '@/services';
import { Student, Teacher, Subject, MonthlyBookingDto, MonthlyBookingResult } from '@/types';
import { Search, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface MonthlyClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export function MonthlyClassesModal({ isOpen, onClose, onSuccess }: MonthlyClassesModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [formData, setFormData] = useState<MonthlyBookingDto>({
    studentId: '',
    teacherId: '',
    subjectId: '',
    dayOfWeek: 1,
    startTime: '',
    endTime: '',
    month: currentMonth,
    year: currentYear,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MonthlyBookingResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      setResult(null);
      setShowResult(false);
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

  // Calcular preview de fechas
  const previewDates = useMemo(() => {
    if (!formData.month || !formData.year || formData.dayOfWeek === undefined) return [];

    const dates: Date[] = [];
    const year = formData.year;
    const month = formData.month;
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === formData.dayOfWeek) {
        dates.push(date);
      }
    }

    return dates;
  }, [formData.month, formData.year, formData.dayOfWeek]);

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
    const numericFields = ['dayOfWeek', 'month', 'year'];
    
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.studentId || !formData.teacherId || !formData.startTime || !formData.endTime) {
      setError('Todos los campos obligatorios deben ser completados');
      return;
    }

    if (previewDates.length === 0) {
      setError('No hay fechas disponibles para el día seleccionado en este mes');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend: MonthlyBookingDto = {
        studentId: formData.studentId,
        teacherId: formData.teacherId,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        month: formData.month,
        year: formData.year,
      };

      if (formData.subjectId) {
        dataToSend.subjectId = formData.subjectId;
      }

      const resultData = await bookingService.createMonthly(dataToSend);
      
      // Validar que resultData tenga la estructura esperada
      if (!resultData || typeof resultData.totalDates !== 'number') {
        throw new Error('Respuesta del servidor en formato inválido');
      }
      
      setResult(resultData);
      setShowResult(true);
      
      // Si todo fue exitoso, cerrar después de un momento
      const allSuccess = resultData.failed.length === 0 && resultData.successful.length > 0;
      if (allSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating monthly classes:', err);
      setError(err instanceof Error ? err.message : 'Error al crear clases mensuales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
      teacherId: '',
      subjectId: '',
      dayOfWeek: 1,
      startTime: '',
      endTime: '',
      month: currentMonth,
      year: currentYear,
    });
    setSearchTerm('');
    setError('');
    setResult(null);
    setShowResult(false);
    onClose();
  };

  const selectedStudent = students.find((s) => s.id === formData.studentId);
  const selectedTeacher = teachers.find((t) => t.id === formData.teacherId);
  const selectedSubject = subjects.find((s) => s.id.toString() === formData.subjectId);
  const selectedDayName = DAYS_OF_WEEK.find((d) => d.value === formData.dayOfWeek)?.label;
  const selectedMonthName = MONTHS.find((m) => m.value === formData.month)?.label;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Clases Mensuales Recurrentes" size="xl">
      {showResult && result ? (
        <div className="space-y-4">
          <Alert
            variant={result.failed.length === 0 ? 'success' : 'warning'}
            onClose={() => setShowResult(false)}
          >
            Se procesaron {result.totalDates} fechas: {result.successful.length} exitosas, {result.failed.length} fallidas
          </Alert>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {/* Clases exitosas */}
            {result.successful.map((booking, index) => (
              <div
                key={`success-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    {new Date(booking.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Clases fallidas */}
            {result.failed.map((item, index) => (
              <div
                key={`failed-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg border bg-red-50 border-red-200"
              >
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    {new Date(item.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-red-700 mt-1">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onSuccess();
                handleClose();
              }}
            >
              Cerrar
            </Button>
          </div>
        </div>
      ) : (
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
                    className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Seleccionar alumno...</option>
                  {filteredStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} - {student.user?.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                {/* Materia */}
                <div>
                  <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-2">
                    Materia (opcional)
                  </label>
                  <select
                    id="subjectId"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sin materia específica</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Día de la semana */}
                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-2">
                    Día de la Semana <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mes */}
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                    Mes <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {MONTHS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Año */}
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Año <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    min={currentYear}
                    max={currentYear + 2}
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Hora inicio */}
                <TimeSelect
                  label="Hora Inicio *"
                  required
                  value={formData.startTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                />

                {/* Hora fin */}
                <TimeSelect
                  label="Hora Fin *"
                  required
                  value={formData.endTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
                  minTime={formData.startTime}
                />
              </div>

              {/* Preview de fechas */}
              {previewDates.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-semibold text-purple-900">
                      Se crearán {previewDates.length} clases:
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {previewDates.map((date, index) => (
                      <div key={index} className="text-xs text-purple-800 bg-white rounded px-2 py-1">
                        {date.toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumen */}
              {(selectedStudent || selectedTeacher) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Configuración:</h3>
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
                    {selectedDayName && (
                      <li>
                        <span className="font-medium">Cada:</span> {selectedDayName}
                      </li>
                    )}
                    {selectedMonthName && formData.year && (
                      <li>
                        <span className="font-medium">Durante:</span> {selectedMonthName} {formData.year}
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
              Crear {previewDates.length} Clases
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
