# ESPECIFICACIONES TÉCNICAS DEL BACKEND - SISTEMA DE GESTIÓN MÉDICA

## ÍNDICE
1. [Arquitectura General](#1-arquitectura-general)
2. [Modelos de Datos](#2-modelos-de-datos)
3. [Endpoints de la API](#3-endpoints-de-la-api)
4. [Autenticación y Seguridad](#4-autenticación-y-seguridad)
5. [Reglas de Negocio](#5-reglas-de-negocio)
6. [Validaciones](#6-validaciones)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Stack Tecnológico Recomendado
- **Framework**: Node.js + Express / NestJS / Django / Spring Boot
- **Base de Datos**: PostgreSQL / MySQL / MongoDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Joi / Yup / Class-validator
- **ORM**: Prisma / TypeORM / Sequelize / Mongoose

### 1.2 Estructura de Capas
```
Backend
├── Controllers (Manejo de peticiones HTTP)
├── Services (Lógica de negocio)
├── Repositories (Acceso a datos)
├── Models (Definición de entidades)
├── Middlewares (Autenticación, validación)
└── Utils (Funciones auxiliares)
```

---

## 2. MODELOS DE DATOS

### 2.1 Usuario (User)
```typescript
interface User {
  id: number | string;
  cedula: string;              // UNIQUE, NOT NULL
  username: string;            // Igual a cédula
  password: string;            // Hasheado con bcrypt
  fullName: string;            // NOT NULL
  email?: string;              // UNIQUE si existe
  role: 'paciente' | 'medico' | 'admin';  // NOT NULL
  
  // Información personal
  direccion?: string;
  edad?: number;
  sexo?: 'masculino' | 'femenino' | 'otro';
  tieneSeguro: boolean;        // DEFAULT false
  telefono?: string;
  avatar?: string;             // URL de la imagen
  fotoPerfil?: string;
  
  // Campos específicos para médicos
  especialidad?: string;       // Solo para role='medico'
  numeroLicencia?: string;     // Solo para role='medico'
  
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;            // Soft delete
}
```

**Índices:**
- PRIMARY KEY: `id`
- UNIQUE: `cedula`, `email`
- INDEX: `role`, `especialidad`

**Relaciones:**
- Un Usuario puede tener muchas Citas (como paciente)
- Un Usuario (médico) puede atender muchas Citas

---

### 2.2 Terapia (Therapy)
```typescript
interface Terapia {
  id: number | string;
  nombre: string;              // NOT NULL
  descripcion: string;         // NOT NULL
  duracion: number;            // Duración en minutos, NOT NULL
  precio: number;              // Precio en USD, NOT NULL
  imagen?: string;             // URL de la imagen
  especialidad: string;        // NOT NULL
  activa: boolean;             // DEFAULT true
  
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

**Índices:**
- PRIMARY KEY: `id`
- INDEX: `especialidad`, `activa`

**Relaciones:**
- Una Terapia puede tener muchas Citas

---

### 2.3 Cita (Appointment)
```typescript
interface Cita {
  id: number | string;
  pacienteId: number | string;  // FOREIGN KEY -> User.id
  medicoId: number | string;    // FOREIGN KEY -> User.id
  terapiaId: number | string;   // FOREIGN KEY -> Terapia.id
  
  // Información de la cita
  fecha: Date;                  // NOT NULL
  hora: string;                 // HH:mm format, NOT NULL
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';  // DEFAULT 'pendiente'
  
  // Información médica
  sintomas: string;             // NOT NULL
  tieneExamenes: boolean;       // DEFAULT false
  examenes?: ArchivoExamen[];   // JSON o tabla relacionada
  
  // Información adicional
  notas?: string;               // Notas del médico
  motivoCancelacion?: string;   // Si estado='cancelada'
  
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `pacienteId`, `medicoId`, `terapiaId`
- INDEX: `fecha`, `estado`, `pacienteId`, `medicoId`
- UNIQUE: `(medicoId, fecha, hora)` - Un médico no puede tener dos citas a la misma hora

**Relaciones:**
- Una Cita pertenece a un Paciente (User)
- Una Cita pertenece a un Médico (User)
- Una Cita pertenece a una Terapia

---

### 2.4 ArchivoExamen (ExamFile)
```typescript
interface ArchivoExamen {
  id: string;
  citaId: number | string;     // FOREIGN KEY -> Cita.id
  nombre: string;              // NOT NULL
  tipo: string;                // MIME type
  url: string;                 // URL del archivo en storage
  tamaño: number;              // Tamaño en bytes
  
  // Auditoría
  fechaSubida: Date;
}
```

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `citaId`

---

### 2.5 HorarioAtencion (Schedule)
```typescript
interface HorarioAtencion {
  id: number | string;
  medicoId: number | string;   // FOREIGN KEY -> User.id
  diaSemana: number;           // 0=Domingo, 6=Sábado
  horaInicio: string;          // HH:mm format
  horaFin: string;             // HH:mm format
  
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `medicoId`
- UNIQUE: `(medicoId, diaSemana, horaInicio)`

---

## 3. ENDPOINTS DE LA API

### 3.1 Autenticación

#### POST /api/auth/register
**Descripción:** Registro de nuevo usuario (solo pacientes)

**Request Body:**
```json
{
  "nombresCompletos": "Juan Pérez García",
  "cedula": "1234567890",
  "password": "password123",
  "direccion": "Av. Principal 123",
  "edad": 35,
  "sexo": "masculino",
  "tieneSeguro": true,
  "telefono": "0999888777",
  "email": "juan@email.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": { /* User object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validaciones:**
- Cédula única
- Email único (si se proporciona)
- Password mínimo 6 caracteres
- Edad entre 1 y 120

---

#### POST /api/auth/login
**Descripción:** Inicio de sesión

**Request Body:**
```json
{
  "cedula": "1234567890",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": { /* User object sin password */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**
- 401: Credenciales inválidas
- 404: Usuario no encontrado

---

#### GET /api/auth/me
**Descripción:** Obtener información del usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* User object sin password */ }
}
```

---

#### POST /api/auth/logout
**Descripción:** Cerrar sesión (opcional, puede manejarse solo en frontend)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### 3.2 Terapias

#### GET /api/terapias
**Descripción:** Obtener todas las terapias activas

**Query Parameters:**
- `especialidad` (opcional): Filtrar por especialidad
- `activa` (opcional): true/false

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Fisioterapia General",
      "descripcion": "Tratamiento para lesiones musculares...",
      "duracion": 60,
      "precio": 45.00,
      "imagen": "https://...",
      "especialidad": "Fisioterapia",
      "activa": true
    }
  ]
}
```

---

#### GET /api/terapias/:id
**Descripción:** Obtener una terapia por ID

**Response (200):**
```json
{
  "success": true,
  "data": { /* Terapia object */ }
}
```

**Errores:**
- 404: Terapia no encontrada

---

### 3.3 Citas

#### GET /api/citas
**Descripción:** Obtener citas del usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `estado` (opcional): pendiente, confirmada, completada, cancelada
- `fecha` (opcional): Filtrar por fecha específica
- `limit` (opcional): Número de resultados
- `offset` (opcional): Para paginación

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pacienteId": 100,
      "medicoId": 1,
      "terapiaId": 1,
      "fecha": "2026-05-05",
      "hora": "10:00",
      "estado": "confirmada",
      "sintomas": "Dolor en la rodilla...",
      "tieneExamenes": false,
      "paciente": { /* User object */ },
      "medico": { /* User object */ },
      "terapia": { /* Terapia object */ }
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 10,
    "offset": 0
  }
}
```

---

#### GET /api/citas/proximas
**Descripción:** Obtener próximas citas del paciente

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [ /* Array de citas futuras ordenadas por fecha */ ]
}
```

---

#### POST /api/citas
**Descripción:** Crear nueva cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "terapiaId": 1,
  "medicoId": 1,
  "fecha": "2026-05-10",
  "hora": "14:00",
  "sintomas": "Dolor en la espalda baja...",
  "tieneExamenes": true,
  "examenes": [ /* Array de archivos */ ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "data": { /* Cita object */ }
}
```

**Validaciones:**
- Fecha debe ser futura
- Hora debe estar disponible para el médico
- Médico debe existir y tener role='medico'
- Terapia debe estar activa

**Errores:**
- 400: Datos inválidos
- 409: Horario no disponible

---

#### PATCH /api/citas/:id
**Descripción:** Actualizar estado de cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "estado": "confirmada",
  "notas": "Notas adicionales..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cita actualizada exitosamente",
  "data": { /* Cita object */ }
}
```

**Permisos:**
- Paciente: Solo puede cancelar sus propias citas
- Médico: Puede actualizar estado y agregar notas
- Admin: Acceso completo

---

#### DELETE /api/citas/:id (o PATCH con estado='cancelada')
**Descripción:** Cancelar cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "motivoCancelacion": "Motivo de la cancelación..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cita cancelada exitosamente"
}
```

**Reglas:**
- Solo se pueden cancelar citas con estado 'pendiente' o 'confirmada'
- No se pueden cancelar citas pasadas

---

### 3.4 Horarios Disponibles

#### GET /api/horarios/disponibles
**Descripción:** Obtener horarios disponibles para una fecha y terapia

**Query Parameters:**
- `terapiaId` (requerido): ID de la terapia
- `fecha` (requerido): Fecha en formato YYYY-MM-DD
- `medicoId` (opcional): Filtrar por médico específico

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "fecha": "2026-05-10",
      "hora": "10:00",
      "disponible": true,
      "medicoId": 1,
      "medicoNombre": "Dr. Carlos Mendoza"
    }
  ]
}
```

**Lógica:**
1. Obtener médicos que ofrecen la terapia (por especialidad)
2. Obtener horarios de atención de cada médico para ese día
3. Verificar citas existentes y marcar horarios ocupados
4. Retornar solo horarios disponibles

---

### 3.5 Médicos

#### GET /api/medicos
**Descripción:** Obtener lista de médicos

**Query Parameters:**
- `especialidad` (opcional): Filtrar por especialidad

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fullName": "Dr. Carlos Mendoza",
      "especialidad": "Fisioterapia",
      "numeroLicencia": "MED-2024-001",
      "calificacion": 4.8,
      "pacientesAtendidos": 150
    }
  ]
}
```

---

#### GET /api/medicos/:id
**Descripción:** Obtener información detallada de un médico

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Dr. Carlos Mendoza",
    "especialidad": "Fisioterapia",
    "numeroLicencia": "MED-2024-001",
    "horarioAtencion": [
      {
        "diaSemana": 1,
        "horaInicio": "08:00",
        "horaFin": "16:00"
      }
    ]
  }
}
```

---

### 3.6 Perfil de Usuario

#### GET /api/usuarios/perfil
**Descripción:** Obtener perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* User object sin password */ }
}
```

---

#### PATCH /api/usuarios/perfil
**Descripción:** Actualizar perfil del usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "telefono": "0999888777",
  "direccion": "Nueva dirección",
  "email": "nuevo@email.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": { /* User object actualizado */ }
}
```

---

## 4. AUTENTICACIÓN Y SEGURIDAD

### 4.1 JWT (JSON Web Tokens)
**Payload del Token:**
```json
{
  "id": 100,
  "cedula": "1234567890",
  "role": "paciente",
  "iat": 1619000000,
  "exp": 1619086400
}
```

**Expiración:** 24 horas (configurable)

**Secret Key:** Variable de entorno `JWT_SECRET`

---

### 4.2 Middleware de Autenticación
```typescript
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}
```

---

### 4.3 Middleware de Autorización por Roles
```typescript
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}
```

**Uso:**
```typescript
router.get('/admin/usuarios', 
  authenticateToken, 
  authorizeRoles('admin'), 
  getUsuarios
);
```

---

### 4.4 Hashing de Contraseñas
**Librería:** bcrypt

**Ejemplo:**
```typescript
import bcrypt from 'bcrypt';

// Al registrar
const hashedPassword = await bcrypt.hash(password, 10);

// Al hacer login
const isValid = await bcrypt.compare(password, user.password);
```

---

## 5. REGLAS DE NEGOCIO

### 5.1 Citas
1. **Horarios Disponibles:**
   - Un médico no puede tener dos citas a la misma hora
   - Las citas solo se pueden agendar en horarios de atención del médico
   - No se pueden agendar citas en fechas pasadas

2. **Estados de Citas:**
   - `pendiente`: Cita creada, esperando confirmación
   - `confirmada`: Cita confirmada por el sistema o médico
   - `completada`: Cita realizada
   - `cancelada`: Cita cancelada por paciente o médico

3. **Cancelaciones:**
   - Solo se pueden cancelar citas con estado 'pendiente' o 'confirmada'
   - Se debe proporcionar un motivo de cancelación
   - No se pueden cancelar citas pasadas

4. **Notificaciones (Futuro):**
   - Enviar email/SMS al crear cita
   - Recordatorio 24 horas antes de la cita
   - Notificación al cancelar cita

---

### 5.2 Usuarios
1. **Registro:**
   - Solo se pueden registrar pacientes desde el frontend
   - Médicos y admins se crean desde panel de administración

2. **Roles:**
   - `paciente`: Puede agendar citas, ver sus citas, actualizar perfil
   - `medico`: Puede ver sus citas asignadas, actualizar estado, agregar notas
   - `admin`: Acceso completo al sistema

---

### 5.3 Terapias
1. Solo terapias activas se muestran en el frontend
2. Al desactivar una terapia, no se cancelan citas existentes
3. Precio y duración son obligatorios

---

## 6. VALIDACIONES

### 6.1 Usuario
- `cedula`: 10-13 caracteres, único
- `password`: Mínimo 6 caracteres
- `email`: Formato válido, único
- `edad`: 1-120
- `telefono`: 10 dígitos (opcional)
- `fullName`: 3-100 caracteres

### 6.2 Cita
- `fecha`: Fecha futura
- `hora`: Formato HH:mm
- `sintomas`: Mínimo 10 caracteres
- `terapiaId`: Debe existir y estar activa
- `medicoId`: Debe existir y tener role='medico'

### 6.3 Terapia
- `nombre`: 3-100 caracteres
- `descripcion`: 10-500 caracteres
- `duracion`: 15-180 minutos
- `precio`: Mayor a 0

---

## 7. VARIABLES DE ENTORNO

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/gestion_medica

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# Puerto
PORT=8080

# CORS
CORS_ORIGIN=http://localhost:3000

# Storage (para archivos)
STORAGE_TYPE=local|s3
AWS_BUCKET_NAME=medical-files
AWS_REGION=us-east-1

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

---

## 8. RESPUESTAS DE ERROR ESTÁNDAR

```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "code": "ERROR_CODE",
  "details": { /* Detalles adicionales si aplica */ }
}
```

**Códigos HTTP:**
- 200: OK
- 201: Created
- 400: Bad Request (datos inválidos)
- 401: Unauthorized (no autenticado)
- 403: Forbidden (sin permisos)
- 404: Not Found
- 409: Conflict (ej: horario ocupado)
- 500: Internal Server Error

---

## CONCLUSIÓN

Este documento proporciona las especificaciones completas para implementar el backend del sistema de gestión médica. El backend debe:

1. **Ser RESTful**: Seguir principios REST
2. **Ser Seguro**: Implementar autenticación JWT y validaciones
3. **Ser Escalable**: Arquitectura en capas
4. **Ser Documentado**: Swagger/OpenAPI para documentación de API
5. **Ser Testeado**: Unit tests y integration tests

### Próximos Pasos:
1. Implementar modelos y migraciones de base de datos
2. Crear endpoints de autenticación
3. Implementar CRUD de terapias y citas
4. Agregar validaciones y manejo de errores
5. Implementar sistema de notificaciones
6. Agregar tests automatizados
7. Documentar API con Swagger
