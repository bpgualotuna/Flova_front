/**
 * Datos mock de usuarios para autenticación
 */

import { User } from '../../types';

export const mockUsuarios: User[] = [
  // Paciente de prueba
  {
    id: 100,
    cedula: '1234567890',
    username: '1234567890',
    fullName: 'Juan Pérez García',
    role: 'paciente',
    direccion: 'Av. Principal 123, Quito',
    edad: 35,
    sexo: 'masculino',
    tieneSeguro: true,
    telefono: '0999888777',
    email: 'juan.perez@email.com',
  },
  
  // Médicos (ya definidos en medicosMock)
  {
    id: 1,
    cedula: '1234567890',
    username: '1234567890',
    fullName: 'Dr. Carlos Mendoza',
    role: 'medico',
    tieneSeguro: true,
    telefono: '0999123456',
    email: 'carlos.mendoza@clinica.com',
  },
  {
    id: 2,
    cedula: '0987654321',
    username: '0987654321',
    fullName: 'Dra. María González',
    role: 'medico',
    tieneSeguro: true,
    telefono: '0998765432',
    email: 'maria.gonzalez@clinica.com',
  },
  
  // Administrador
  {
    id: 999,
    cedula: 'admin',
    username: 'admin',
    fullName: 'Administrador del Sistema',
    role: 'admin',
    tieneSeguro: true,
    telefono: '0999000000',
    email: 'admin@clinica.com',
  },
];

// Contraseñas mock (en producción esto estaría en el backend)
export const mockPasswords: Record<string, string> = {
  '1234567890': 'password123',  // Paciente
  '0987654321': 'medico123',    // Médico 1
  '1122334455': 'medico123',    // Médico 2
  'admin': 'admin123',          // Admin
};
