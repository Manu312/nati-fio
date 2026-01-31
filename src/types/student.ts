/**
 * Student Types - Sistema de Gestión de Alumnos
 */

export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  parentEmail?: string;
  tutorFirstName?: string;
  tutorLastName?: string;
  grade?: string;
  school?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface CreateStudentDto {
  userId: string;
  firstName: string;
  lastName?: string;
  parentEmail?: string;
  tutorFirstName?: string;
  tutorLastName?: string;
  grade?: string;
  school?: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  parentEmail?: string;
  tutorFirstName?: string;
  tutorLastName?: string;
  grade?: string;
  school?: string;
}
