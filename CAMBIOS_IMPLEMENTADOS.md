# CAMBIOS IMPLEMENTADOS - SISTEMA DE GESTIÓN MÉDICA

## FECHA: Mayo 2026
## VERSIÓN: 2.0

---

## ÍNDICE
1. [Resumen de Cambios](#1-resumen-de-cambios)
2. [Formulario de Registro](#2-formulario-de-registro)
3. [Reglas de Negocio - Citas](#3-reglas-de-negocio---citas)
4. [Roles y Perfiles](#4-roles-y-perfiles)
5. [Nuevas Páginas](#5-nuevas-páginas)
6. [Archivos Modificados](#6-archivos-modificados)
7. [Archivos Creados](#7-archivos-creados)
8. [Endpoints Backend Necesarios](#8-endpoints-backend-necesarios)
9. [Guía de Pruebas](#9-guía-de-pruebas)

---

## 1. RESUMEN DE CAMBIOS

### 1.1 Cambios en UI
- ✅ Formulario de registro actualizado con dropdown de seguros
- ✅ Validaciones de citas implementadas en frontend
- ✅ Nuevas páginas de administración
- ✅ Nueva página para médicos
- ✅ **Nueva página de selección de médico por especialidad**
- ✅ Menú dinámico según rol de usuario
- ✅ **Flujo de reserva actualizado con selección de médico**

### 1.2 Cambios en Lógica de Negocio
- ✅ Validación de anticipación mínima (12 horas)
- ✅ Validación de doble reserva
- ✅ Validación de cancelación (24 horas)
- ✅ Sistema de roles completo (Admin, Médico, Paciente)
- ✅ **Filtrado de médicos por especialidad de terapia**
- ✅ **Filtrado de horarios por médico seleccionado**

### 1.3 Cambios en Modelos de Datos
- ✅ Campo `tipoSeguro` agregado al modelo User
- ✅ Campo `tieneSeguro` marcado como deprecated
- ✅ Nuevos tipos de seguro definidos
- ✅ **Relación médico-terapia por campo `especialidad`**

---

## 1.5 FLUJO DE RESERVA DE CITAS (ACTUALIZADO)

### Nuevo Flujo Implementado

El flujo de reserva ahora incluye la selección de médico especialista basado en la terapia elegida:

```
1. Selección de Terapia (TherapySelectionPage)
   ↓ Guarda terapia en sessionStorage
   
2. Selección de Médico (DoctorSelectionPage) ← NUEVO
   ↓ Filtra médicos por especialidad
   ↓ Guarda médico en sessionStorage
   
3. Selección de Fecha y Hora (CalendarPage)
   ↓ Filtra horarios por médico seleccionado
   ↓ Guarda fecha, hora y medicoId
   
4. Formulario de Información Médica (AppointmentFormPage)
   ↓ Guarda síntomas y exámenes
   
5. Confirmación y Creación de Cita (ConfirmationPage)
   ↓ Muestra resumen completo incluyendo médico
   ↓ Crea la cita y limpia sessionStorage
```

### Detalles de Implementación

#### **DoctorSelectionPage** (NUEVO)
- **Ubicación:** `src/pages/appointments/DoctorSelectionPage.tsx`
- **Funcionalidad:**
  - Obtiene terapia seleccionada desde `sessionStorage`
  - Usa `useGetMedicosByEspecialidadQuery(terapia.especialidad)` para filtrar médicos
  - Muestra cards con información completa del médico:
    * Nombre completo y avatar
    * Especialidad y número de licencia
    * Calificación (rating) y pacientes atendidos
    * Horario de atención (días y horas)
  - Permite seleccionar un médico (visual feedback con borde y check)
  - Guarda médico seleccionado en `sessionStorage.setItem('selectedMedico', ...)`
  - Navegación: Volver a Terapias | Continuar al Calendario
  - Validación: Si no hay terapia seleccionada, redirige a `/terapias`

#### **TherapySelectionPage** (ACTUALIZADO)
- **Cambio en navegación:**
  ```typescript
  // ANTES
  navigate('/calendario');
  
  // AHORA
  navigate('/seleccion-medico');
  ```
- Mantiene funcionalidad de búsqueda y filtrado de terapias
- Guarda terapia en `sessionStorage` antes de navegar

#### **CalendarPage** (ACTUALIZADO)
- **Cambios principales:**
  1. **Carga de datos desde sessionStorage:**
     ```typescript
     const [terapia, setTerapia] = useState<Terapia | null>(null);
     const [medico, setMedico] = useState<Medico | null>(null);
     
     useEffect(() => {
       const terapiaStr = sessionStorage.getItem('selectedTerapia');
       const medicoStr = sessionStorage.getItem('selectedMedico');
       
       if (!terapiaStr || !medicoStr) {
         navigate(ROUTES.TERAPIAS);
         return;
       }
       
       setTerapia(JSON.parse(terapiaStr));
       setMedico(JSON.parse(medicoStr));
     }, [navigate]);
     ```
  
  2. **Filtrado de horarios por médico:**
     ```typescript
     const { data: horariosRaw = [], isLoading } = useGetHorariosDisponiblesQuery(...);
     const horarios = horariosRaw.filter(h => h.medicoId === medico?.id);
     ```
  
  3. **Card informativa:**
     - Muestra terapia seleccionada (nombre, duración, precio)
     - Muestra médico seleccionado (nombre, especialidad, avatar)
  
  4. **Navegación actualizada:**
     - Botón "Volver" ahora va a `/seleccion-medico` (no a `/terapias`)
  
  5. **Validación mejorada:**
     - Verifica que existan tanto terapia como médico
     - Si falta alguno, redirige a `/terapias`

#### **ConfirmationPage** (ACTUALIZADO)
- **Cambios:**
  1. Lee médico desde sessionStorage:
     ```typescript
     const medicoStr = sessionStorage.getItem('selectedMedico');
     const medico = medicoStr ? JSON.parse(medicoStr) : null;
     ```
  
  2. Muestra información del médico en resumen:
     ```
     Terapia: [nombre]
     Médico: [fullName]
            [especialidad]
     Fecha: [fecha completa]
     ...
     ```
  
  3. Valida que exista médico antes de mostrar confirmación
  
  4. Limpia médico de sessionStorage al confirmar:
     ```typescript
     sessionStorage.removeItem('selectedMedico');
     ```

#### **Router** (ACTUALIZADO)
- **Nueva ruta agregada:**
  ```typescript
  export const ROUTES = {
    // ...
    SELECCION_MEDICO: '/seleccion-medico',
    // ...
  };
  ```

- **Nueva ruta configurada:**
  ```typescript
  {
    path: ROUTES.SELECCION_MEDICO,
    element: (
      <Suspense fallback={<PageLoader />}>
        <RoleGuard allowedRoles={['paciente']}>
          <DoctorSelectionPage />
        </RoleGuard>
      </Suspense>
    ),
  }
  ```

- Lazy loading de `DoctorSelectionPage`
- Protegida con `RoleGuard` para rol 'paciente'

### Relación Médico-Terapia

Los médicos están relacionados con las terapias a través del campo `especialidad`:

```typescript
// Terapia
{
  id: 1,
  nombre: "Fisioterapia Deportiva",
  especialidad: "Fisioterapia",  // ← Campo clave
  // ...
}

// Médico
{
  id: 1,
  fullName: "Dr. Carlos Mendoza",
  especialidad: "Fisioterapia",  // ← Debe coincidir
  // ...
}
```

**Query utilizado:**
```typescript
useGetMedicosByEspecialidadQuery(terapia.especialidad)
```

Este query filtra los médicos que tienen la misma especialidad que la terapia seleccionada.

### SessionStorage Management

El flujo utiliza `sessionStorage` para mantener el estado entre páginas:

| Key | Contenido | Guardado en | Usado en | Limpiado en |
|-----|-----------|-------------|----------|-------------|
| `selectedTerapia` | Objeto Terapia completo | TherapySelectionPage | DoctorSelectionPage, CalendarPage, ConfirmationPage | ConfirmationPage (al confirmar) |
| `selectedMedico` | Objeto Medico completo | DoctorSelectionPage | CalendarPage, ConfirmationPage | ConfirmationPage (al confirmar) |
| `appointmentData` | Datos de la cita (terapiaId, medicoId, fecha, hora, síntomas, etc.) | CalendarPage, AppointmentFormPage | AppointmentFormPage, ConfirmationPage | ConfirmationPage (al confirmar) |

---

## 2. FORMULARIO DE REGISTRO

### 2.1 Cambio Implementado
El checkbox "¿Tiene seguro de salud?" fue reemplazado por un dropdown (select) con las siguientes opciones:

```typescript
type TipoSeguro = 
  | 'ninguno'          // No tengo seguro
  | 'iess'             // Seguro IESS
  | 'ejercito'         // Seguro del Ejército
  | 'policia'          // Seguro Policial
  | 'issfa'            // ISSFA (Instituto de Seguridad Social de las Fuerzas Armadas)
  | 'isspol'           // ISSPOL (Instituto de Seguridad Social de la Policía)
  | 'privado';         // Seguro Privado
```

### 2.2 Ubicación en el Código
**Archivo:** `src/pages/auth/RegisterPage.tsx`

**Componente:**
```tsx
<TextField
  fullWidth
  select
  label="Tipo de Seguro"
  {...register('tipoSeguro')}
  error={!!errors.tipoSeguro}
  helperText={errors.tipoSeguro?.message}
  defaultValue="ninguno"
>
  <MenuItem value="ninguno">No tengo seguro</MenuItem>
  <MenuItem value="iess">Seguro IESS</MenuItem>
  <MenuItem value="ejercito">Seguro del Ejército</MenuItem>
  <MenuItem value="policia">Seguro Policial</MenuItem>
  <MenuItem value="issfa">ISSFA</MenuItem>
  <MenuItem value="isspol">ISSPOL</MenuItem>
  <MenuItem value="privado">Seguro Privado</MenuItem>
</TextField>
```

### 2.3 Validación
El campo es obligatorio y se valida con Zod:
```typescript
tipoSeguro: z.enum(['ninguno', 'iess', 'ejercito', 'policia', 'privado', 'issfa', 'isspol'])
```

---

## 3. REGLAS DE NEGOCIO - CITAS

### 3.1 Anticipación Mínima (12 horas)

**Descripción:** Las citas deben reservarse con al menos 12 horas de anticipación desde el momento actual.

**Ejemplo:**
- Hora actual: 1 de mayo, 10:00 AM
- Hora mínima permitida: 1 de mayo, 10:00 PM

**Implementación:**
```typescript
// src/utils/citasValidations.ts
export const validarAnticipacionMinima = (fecha: string, hora: string) => {
  const ahora = new Date();
  const fechaCita = new Date(`${fecha}T${hora}:00`);
  const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  
  if (diferenciaHoras < 12) {
    return {
      valid: false,
      message: 'Las citas deben reservarse con al menos 12 horas de anticipación.',
    };
  }
  return { valid: true };
};
```

**Dónde se aplica:**
- Al crear una nueva cita (frontend y backend)
- En el servicio `citasApi.ts` método `createCita`

---

### 3.2 Restricción de Doble Reserva

**Descripción:** Un usuario NO puede reservar dos citas en la misma fecha y hora, aunque sean de diferentes especialidades.

**Ejemplo:**
- Usuario tiene cita el 5 de mayo a las 10:00 AM (Fisioterapia)
- NO puede reservar otra cita el 5 de mayo a las 10:00 AM (Psicología)

**Implementación:**
```typescript
// src/utils/citasValidations.ts
export const validarDobleReserva = (
  pacienteId: number | string,
  fecha: string,
  hora: string,
  citas: Cita[]
) => {
  const citaExistente = citas.find(
    (cita) =>
      cita.pacienteId === pacienteId &&
      cita.fecha === fecha &&
      cita.hora === hora &&
      (cita.estado === 'pendiente' || cita.estado === 'confirmada')
  );
  
  if (citaExistente) {
    return {
      valid: false,
      message: 'Ya tienes una cita reservada en esta fecha y hora.',
    };
  }
  return { valid: true };
};
```

**Dónde se aplica:**
- Al crear una nueva cita
- Verifica solo citas activas (pendiente o confirmada)

---

### 3.3 Cancelación con Anticipación (24 horas)

**Descripción:** Una cita solo puede cancelarse con mínimo 24 horas de anticipación respecto a la fecha de la cita.

**Ejemplo:**
- Cita programada: 5 de mayo, 10:00 AM
- Fecha límite de cancelación: 4 de mayo, 10:00 AM

**Implementación:**
```typescript
// src/utils/citasValidations.ts
export const validarCancelacion = (fecha: string, hora: string) => {
  const ahora = new Date();
  const fechaCita = new Date(`${fecha}T${hora}:00`);
  const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  
  if (diferenciaHoras < 24) {
    return {
      valid: false,
      message: 'Solo puedes cancelar citas con al menos 24 horas de anticipación.',
    };
  }
  return { valid: true };
};
```

**Dónde se aplica:**
- Al intentar cancelar una cita
- En el servicio `citasApi.ts` método `cancelarCita`
- En la página `MyCitasPage.tsx`

---

## 4. ROLES Y PERFILES

### 4.1 Roles Implementados

#### ADMIN (Administrador)
**Permisos:**
- ✅ Visualizar lista de usuarios del sistema
- ✅ Agregar, editar y eliminar usuarios
- ✅ Agregar, editar y gestionar terapias
- ✅ Activar/desactivar terapias
- ✅ Acceso completo al sistema

**Páginas:**
- `/admin/usuarios` - Gestión de Usuarios
- `/admin/terapias` - Gestión de Terapias

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

---

#### PACIENTE
**Permisos:**
- ✅ Reservar citas
- ✅ Ver sus propias citas
- ✅ Cancelar citas (con restricción de 24 horas)
- ✅ Actualizar su perfil

**Páginas:**
- `/dashboard` - Dashboard
- `/terapias` - Selección de terapias
- `/calendario` - Calendario de disponibilidad
- `/formulario-cita` - Formulario de cita
- `/mis-citas` - Gestión de citas
- `/perfil` - Perfil de usuario

**Credenciales de prueba:**
- Usuario: `1234567890`
- Contraseña: `password123`

---

#### MÉDICO
**Permisos:**
- ✅ Visualizar sus citas asignadas
- ✅ Ver información de pacientes
- ✅ Confirmar citas
- ✅ Completar citas
- ✅ Agregar notas a las citas

**Páginas:**
- `/dashboard` - Dashboard
- `/medico/citas` - Gestión de citas del médico
- `/perfil` - Perfil de usuario

**Credenciales de prueba:**
- Usuario: `1234567890` (Dr. Carlos Mendoza)
- Contraseña: `password123`

---

### 4.2 Diferenciación de Usuarios

Los usuarios del sistema incluyen:
1. **Pacientes** - Usuarios que reservan citas
2. **Médicos Especialistas** - Profesionales que atienden citas
3. **Administradores** - Gestores del sistema

El acceso a las páginas está controlado por:
- `ProtectedRoute` - Verifica autenticación
- `RoleGuard` - Verifica roles permitidos

---

## 5. NUEVAS PÁGINAS

### 5.1 Gestión de Usuarios (Admin)
**Ruta:** `/admin/usuarios`  
**Archivo:** `src/pages/admin/UsersManagementPage.tsx`

**Características:**
- ✅ Tabla con DataGrid de MUI
- ✅ Búsqueda por nombre, cédula o email
- ✅ Filtro por rol
- ✅ Estadísticas rápidas (total usuarios, pacientes, médicos, admins)
- ✅ Acciones: Editar, Eliminar
- ✅ Botón para agregar nuevo usuario

**Componentes principales:**
- DataGrid con columnas: Avatar, Nombre, Cédula, Rol, Email, Teléfono, Acciones
- Filtros de búsqueda y rol
- Cards de estadísticas

---

### 5.2 Gestión de Terapias (Admin)
**Ruta:** `/admin/terapias`  
**Archivo:** `src/pages/admin/TherapiesManagementPage.tsx`

**Características:**
- ✅ Grid de cards con terapias
- ✅ Búsqueda por nombre o especialidad
- ✅ Estadísticas (total, activas, inactivas, precio promedio)
- ✅ Acciones: Editar, Activar/Desactivar, Eliminar
- ✅ Dialog para crear/editar terapia
- ✅ Validación con Zod

**Formulario de terapia:**
- Nombre
- Descripción
- Especialidad
- Duración (minutos)
- Precio (USD)
- URL de imagen (opcional)

---

### 5.3 Citas del Médico
**Ruta:** `/medico/citas`  
**Archivo:** `src/pages/medico/MedicoCitasPage.tsx`

**Características:**
- ✅ Tabs: Hoy, Próximas, Completadas, Todas
- ✅ Estadísticas (citas hoy, pendientes, completadas)
- ✅ Información detallada del paciente
- ✅ Acciones: Confirmar, Completar
- ✅ Agregar notas a la cita

**Información mostrada:**
- Datos del paciente (nombre, cédula, teléfono)
- Información de la cita (fecha, hora, terapia)
- Síntomas reportados
- Estado de la cita
- Notas (si existen)

---

## 6. ARCHIVOS MODIFICADOS

### 6.1 Tipos y Modelos
```
src/types/index.ts
```
**Cambios:**
- Agregado tipo `TipoSeguro`
- Agregado campo `tipoSeguro` a interface `User`
- Actualizado interface `RegisterData`

---

### 6.2 Formularios
```
src/pages/auth/RegisterPage.tsx
```
**Cambios:**
- Reemplazado checkbox por dropdown de seguros
- Actualizado schema de validación Zod
- Actualizado defaultValues del formulario

---

### 6.3 Servicios
```
src/services/authService.ts
src/services/citasApi.ts
```
**Cambios:**
- Actualizado método `register` para manejar `tipoSeguro`
- Agregadas validaciones en `createCita`
- Agregadas validaciones en `cancelarCita`

---

### 6.4 Mocks
```
src/services/mocks/usuariosMock.ts
src/services/mocks/medicosMock.ts
```
**Cambios:**
- Agregado campo `tipoSeguro` a todos los usuarios
- Mantenido `tieneSeguro` por compatibilidad

---

### 6.5 Router
```
src/app/router.tsx
```
**Cambios:**
- Agregadas rutas de admin: `/admin/usuarios`, `/admin/terapias`
- Agregada ruta de médico: `/medico/citas`
- **Agregada ruta de selección de médico: `/seleccion-medico`**
- Agregados guards de roles
- **Lazy loading de `DoctorSelectionPage`**

---

### 6.6 Layout
```
src/components/layout/MainLayout.tsx
```
**Cambios:**
- Actualizado menú para mostrar opciones según rol
- Agregadas opciones de admin
- Agregadas opciones de médico

---

### 6.7 Páginas de Citas (ACTUALIZADAS)
```
src/pages/therapies/TherapySelectionPage.tsx
src/pages/appointments/CalendarPage.tsx
src/pages/appointments/ConfirmationPage.tsx
```
**Cambios:**
- **TherapySelectionPage:** Navegación cambiada de `/calendario` a `/seleccion-medico`
- **CalendarPage:** 
  - Lee terapia y médico desde sessionStorage
  - Filtra horarios por médico seleccionado
  - Muestra card informativa con terapia y médico
  - Navegación actualizada (volver a selección de médico)
- **ConfirmationPage:**
  - Lee y muestra información del médico seleccionado
  - Valida existencia de médico
  - Limpia médico de sessionStorage al confirmar

---

## 7. ARCHIVOS CREADOS

### 7.1 Página de Selección de Médico (NUEVO)
```
src/pages/appointments/DoctorSelectionPage.tsx
```
**Descripción:** Página para seleccionar médico especialista según la terapia elegida

**Características:**
- ✅ Filtra médicos por especialidad de la terapia
- ✅ Muestra cards con información completa del médico
- ✅ Rating y pacientes atendidos
- ✅ Horarios de atención
- ✅ Selección visual con feedback
- ✅ Validación de terapia seleccionada
- ✅ Navegación: Terapias ← → Calendario

**Hooks utilizados:**
- `useGetMedicosByEspecialidadQuery(especialidad)` - Filtra médicos por especialidad
- `useState` - Manejo de terapia y médico seleccionados
- `useEffect` - Carga de terapia desde sessionStorage
- `useNavigate` - Navegación entre páginas

**SessionStorage:**
- Lee: `selectedTerapia`
- Escribe: `selectedMedico`

---

### 7.2 Utilidades
```
src/utils/citasValidations.ts
```
**Contenido:**
- `validarAnticipacionMinima()` - Valida 12 horas de anticipación
- `validarDobleReserva()` - Valida que no haya doble reserva
- `validarCancelacion()` - Valida 24 horas para cancelar
- `validarFechaFutura()` - Valida que la fecha no sea pasada
- `validarCreacionCita()` - Valida todas las reglas al crear
- `formatearErroresCita()` - Formatea mensajes de error

---

### 7.2 Páginas de Admin
```
src/pages/admin/UsersManagementPage.tsx
src/pages/admin/TherapiesManagementPage.tsx
```

---

### 7.3 Páginas de Médico
```
src/pages/medico/MedicoCitasPage.tsx
```

---

### 7.4 Documentación
```
CAMBIOS_IMPLEMENTADOS.md (este archivo)
```

---

## 8. ENDPOINTS BACKEND NECESARIOS

### 8.1 Usuarios

#### GET /api/admin/usuarios
**Descripción:** Obtener lista de todos los usuarios (solo admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `role` (opcional): Filtrar por rol
- `search` (opcional): Buscar por nombre, cédula o email
- `page` (opcional): Número de página
- `limit` (opcional): Resultados por página

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "cedula": "1234567890",
      "fullName": "Juan Pérez",
      "role": "paciente",
      "email": "juan@email.com",
      "telefono": "0999888777",
      "tipoSeguro": "iess",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

#### POST /api/admin/usuarios
**Descripción:** Crear nuevo usuario (admin o médico)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cedula": "1234567890",
  "fullName": "Dr. Juan Pérez",
  "password": "password123",
  "role": "medico",
  "email": "juan@clinica.com",
  "telefono": "0999888777",
  "tipoSeguro": "iess",
  "especialidad": "Fisioterapia",
  "numeroLicencia": "MED-2024-001"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": { /* User object */ }
}
```

---

#### PATCH /api/admin/usuarios/:id
**Descripción:** Actualizar usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "Dr. Juan Pérez García",
  "email": "nuevo@email.com",
  "telefono": "0999888777"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": { /* User object */ }
}
```

---

#### DELETE /api/admin/usuarios/:id
**Descripción:** Eliminar usuario (soft delete)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

### 8.2 Terapias (Admin)

#### POST /api/admin/terapias
**Descripción:** Crear nueva terapia

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nombre": "Fisioterapia General",
  "descripcion": "Tratamiento para lesiones musculares...",
  "duracion": 60,
  "precio": 45.00,
  "especialidad": "Fisioterapia",
  "imagen": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Terapia creada exitosamente",
  "data": { /* Terapia object */ }
}
```

---

#### PATCH /api/admin/terapias/:id
**Descripción:** Actualizar terapia

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nombre": "Fisioterapia Avanzada",
  "precio": 50.00,
  "activa": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Terapia actualizada exitosamente",
  "data": { /* Terapia object */ }
}
```

---

#### DELETE /api/admin/terapias/:id
**Descripción:** Eliminar terapia

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Terapia eliminada exitosamente"
}
```

---

### 8.3 Citas (Médico)

#### GET /api/medico/citas
**Descripción:** Obtener citas del médico autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `fecha` (opcional): Filtrar por fecha específica
- `estado` (opcional): Filtrar por estado

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "paciente": {
        "id": 100,
        "fullName": "Juan Pérez",
        "cedula": "1234567890",
        "telefono": "0999888777"
      },
      "terapia": {
        "id": 1,
        "nombre": "Fisioterapia General"
      },
      "fecha": "2026-05-05",
      "hora": "10:00",
      "estado": "pendiente",
      "sintomas": "Dolor en la rodilla...",
      "tieneExamenes": false
    }
  ]
}
```

---

#### PATCH /api/medico/citas/:id/confirmar
**Descripción:** Confirmar una cita

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cita confirmada exitosamente",
  "data": { /* Cita object */ }
}
```

---

#### PATCH /api/medico/citas/:id/completar
**Descripción:** Completar una cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notas": "Paciente presenta mejoría..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cita completada exitosamente",
  "data": { /* Cita object */ }
}
```

---

### 8.4 Validaciones en Backend

**IMPORTANTE:** El backend debe implementar las mismas validaciones que el frontend:

```typescript
// Validación al crear cita
POST /api/citas
{
  // Validar:
  // 1. Fecha futura
  // 2. Anticipación mínima de 12 horas
  // 3. No doble reserva (mismo paciente, misma fecha/hora)
  // 4. Médico disponible en ese horario
  // 5. Terapia activa
}

// Validación al cancelar cita
DELETE /api/citas/:id
{
  // Validar:
  // 1. Anticipación mínima de 24 horas
  // 2. Estado debe ser 'pendiente' o 'confirmada'
  // 3. Usuario es el dueño de la cita o es admin
}
```

---

## 9. GUÍA DE PRUEBAS

### 9.1 Pruebas de Registro

**Caso 1: Registro exitoso con seguro IESS**
1. Ir a `/register`
2. Llenar formulario con datos válidos
3. Seleccionar "Seguro IESS" en el dropdown
4. Hacer clic en "Registrarse"
5. ✅ Debe redirigir al dashboard

**Caso 2: Registro sin seguro**
1. Ir a `/register`
2. Llenar formulario con datos válidos
3. Seleccionar "No tengo seguro"
4. Hacer clic en "Registrarse"
5. ✅ Debe redirigir al dashboard

---

### 9.2 Pruebas de Reglas de Negocio

**Caso 1: Anticipación mínima (12 horas)**
1. Iniciar sesión como paciente
2. Ir a `/terapias` y seleccionar una terapia
3. Intentar reservar una cita para dentro de 6 horas
4. ✅ Debe mostrar error: "Las citas deben reservarse con al menos 12 horas de anticipación"

**Caso 2: Doble reserva**
1. Iniciar sesión como paciente
2. Reservar una cita para el 10 de mayo a las 10:00 AM
3. Intentar reservar otra cita para el 10 de mayo a las 10:00 AM (diferente terapia)
4. ✅ Debe mostrar error: "Ya tienes una cita reservada en esta fecha y hora"

**Caso 3: Cancelación con anticipación**
1. Iniciar sesión como paciente
2. Ir a "Mis Citas"
3. Intentar cancelar una cita que es en menos de 24 horas
4. ✅ Debe mostrar error: "Solo puedes cancelar citas con al menos 24 horas de anticipación"

**Caso 4: Cancelación exitosa**
1. Iniciar sesión como paciente
2. Ir a "Mis Citas"
3. Cancelar una cita que es en más de 24 horas
4. Escribir motivo de cancelación
5. ✅ Debe cancelar exitosamente

---

### 9.3 Pruebas de Roles

**Caso 1: Acceso de Admin**
1. Iniciar sesión con usuario: `admin`, contraseña: `admin123`
2. ✅ Debe ver opciones: "Gestión de Usuarios" y "Gestión de Terapias" en el menú
3. Ir a `/admin/usuarios`
4. ✅ Debe ver tabla con todos los usuarios
5. Ir a `/admin/terapias`
6. ✅ Debe ver grid con todas las terapias

**Caso 2: Acceso de Médico**
1. Iniciar sesión con usuario: `1234567890`, contraseña: `password123`
2. ✅ Debe ver opción "Mis Citas" en el menú
3. Ir a `/medico/citas`
4. ✅ Debe ver sus citas asignadas
5. Intentar acceder a `/admin/usuarios`
6. ✅ Debe mostrar "Acceso Denegado"

**Caso 3: Acceso de Paciente**
1. Iniciar sesión con usuario: `1234567890`, contraseña: `password123`
2. ✅ Debe ver opciones: "Terapias" y "Mis Citas" en el menú
3. Intentar acceder a `/admin/usuarios`
4. ✅ Debe mostrar "Acceso Denegado"
5. Intentar acceder a `/medico/citas`
6. ✅ Debe mostrar "Acceso Denegado"

---

### 9.4 Pruebas de Gestión de Terapias (Admin)

**Caso 1: Crear terapia**
1. Iniciar sesión como admin
2. Ir a `/admin/terapias`
3. Hacer clic en "Nueva Terapia"
4. Llenar formulario con datos válidos
5. Hacer clic en "Crear"
6. ✅ Debe crear la terapia y mostrarla en el grid

**Caso 2: Editar terapia**
1. Iniciar sesión como admin
2. Ir a `/admin/terapias`
3. Hacer clic en el ícono de editar de una terapia
4. Modificar datos
5. Hacer clic en "Actualizar"
6. ✅ Debe actualizar la terapia

**Caso 3: Desactivar terapia**
1. Iniciar sesión como admin
2. Ir a `/admin/terapias`
3. Hacer clic en el ícono de desactivar
4. Confirmar acción
5. ✅ Debe cambiar el estado a "Inactiva"
6. Ir a `/terapias` como paciente
7. ✅ La terapia NO debe aparecer en la lista

---

### 9.5 Pruebas de Citas del Médico

**Caso 1: Ver citas del día**
1. Iniciar sesión como médico
2. Ir a `/medico/citas`
3. ✅ Debe ver tab "Hoy" con citas del día actual

**Caso 2: Confirmar cita**
1. Iniciar sesión como médico
2. Ir a `/medico/citas`
3. Hacer clic en "Confirmar" en una cita pendiente
4. Confirmar acción
5. ✅ Debe cambiar el estado a "confirmada"

**Caso 3: Completar cita**
1. Iniciar sesión como médico
2. Ir a `/medico/citas`
3. Hacer clic en "Completar" en una cita confirmada
4. Escribir notas (opcional)
5. Confirmar acción
6. ✅ Debe cambiar el estado a "completada"

---

## 10. PRÓXIMOS PASOS

### 10.1 Backend
1. Implementar endpoints de administración
2. Implementar endpoints de médico
3. Agregar validaciones de reglas de negocio
4. Implementar sistema de notificaciones
5. Agregar tests automatizados

### 10.2 Frontend
1. Conectar con backend real (reemplazar mocks)
2. Implementar subida de archivos de exámenes
3. Agregar sistema de notificaciones en tiempo real
4. Implementar calendario visual para médicos
5. Agregar reportes y estadísticas avanzadas

### 10.3 Mejoras
1. Implementar sistema de calificaciones para médicos
2. Agregar chat entre paciente y médico
3. Implementar recordatorios automáticos
4. Agregar historial médico del paciente
5. Implementar sistema de pagos

---

## CONCLUSIÓN

Todos los cambios solicitados han sido implementados exitosamente:

✅ **Formulario de registro** actualizado con dropdown de seguros  
✅ **Reglas de negocio** implementadas (anticipación, doble reserva, cancelación)  
✅ **Sistema de roles** completo (Admin, Médico, Paciente)  
✅ **Páginas de administración** creadas y funcionales  
✅ **Página de médico** creada y funcional  
✅ **Documentación** actualizada y completa  

El sistema está listo para conectarse con el backend siguiendo las especificaciones de este documento.

---

**Desarrollado con ❤️ siguiendo mejores prácticas y arquitectura profesional**
