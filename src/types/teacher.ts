/**
 * Teacher Types - Gestión de Profesores
 */

import { User } from './user';

export interface Subject {
  id: number;
  name: string;
  description?: string;
  level?: string;
}

export interface CreateSubjectDto {
  name: string;
  description?: string;
  level?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
  level?: string;
}

export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  maxCapacity: number;
  user?: {
    email: string;
  };
  subjects?: Subject[];
}

export interface CreateTeacherDto {
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  maxCapacity?: number;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  maxCapacity?: number;
  subjectIds?: string[];
}
