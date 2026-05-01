# FLUJO DE SELECCIÓN DE MÉDICO - IMPLEMENTACIÓN COMPLETA

## 📋 RESUMEN

Se ha implementado exitosamente el flujo de selección de médico especialista en el proceso de reserva de citas. Los médicos están ahora ligados a las terapias a través del campo `especialidad`, permitiendo que los pacientes elijan primero la terapia y luego el médico especialista que puede realizar ese tratamiento.

**Fecha de implementación:** Mayo 2026  
**Estado:** ✅ Completado y funcional

---

## 🔄 FLUJO ACTUALIZADO

### Antes
```
Terapia → Calendario → Formulario → Confirmación
```

### Ahora
```
Terapia → Médico → Calendario → Formulario → Confirmación
```

---

## 📁 ARCHIVOS MODIFICADOS

### 1. **src/app/router.tsx**
**Cambios:**
- ✅ Agregada constante `SELECCION_MEDICO: '/seleccion-medico'`
- ✅ Importado `DoctorSelectionPage` con lazy loading
- ✅ Agregada ruta protegida para selección de médico

```typescript
// Nueva importación
const DoctorSelectionPage = lazy(() => import('../pages/appointments/DoctorSelectionPage'));

// Nueva constante en ROUTES
SELECCION_MEDICO: '/seleccion-medico',

// Nueva ruta
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

---

### 2. **src/pages/therapies/TherapySelectionPage.tsx**
**Cambios:**
- ✅ Navegación actualizada de `/calendario` a `/seleccion-medico`

```typescript
const handleSelectTerapia = (terapia: Terapia) => {
  sessionStorage.setItem('selectedTerapia', JSON.stringify(terapia));
  navigate('/seleccion-medico'); // ← Cambio aquí
};
```

---

### 3. **src/pages/appointments/CalendarPage.tsx**
**Cambios principales:**
- ✅ Lee terapia y médico desde sessionStorage con useEffect
- ✅ Valida que ambos existan, sino redirige
- ✅ Filtra horarios solo del médico seleccionado
- ✅ Muestra card informativa con terapia y médico
- ✅ Navegación actualizada (volver a selección de médico)

```typescript
// Nuevos estados
const [terapia, setTerapia] = useState<Terapia | null>(null);
const [medico, setMedico] = useState<Medico | null>(null);

// Carga desde sessionStorage
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

// Filtrado de horarios
const { data: horariosRaw = [], isLoading } = useGetHorariosDisponiblesQuery(...);
const horarios = horariosRaw.filter(h => h.medicoId === medico?.id);

// Validación
if (!terapia || !medico) {
  return <Alert>No se ha completado la selección...</Alert>;
}
```

**Nuevos imports:**
```typescript
import { useState, useEffect } from 'react';
import { Terapia, Medico } from '../../types';
import { Avatar } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
```

---

### 4. **src/pages/appointments/ConfirmationPage.tsx**
**Cambios:**
- ✅ Lee médico desde sessionStorage
- ✅ Muestra información del médico en resumen
- ✅ Valida existencia de médico
- ✅ Limpia médico de sessionStorage al confirmar

```typescript
// Leer médico
const medicoStr = sessionStorage.getItem('selectedMedico');
const medico = medicoStr ? JSON.parse(medicoStr) : null;

// Validación
if (!terapia || !medico || !appointmentData) {
  return <Alert>No se encontraron datos...</Alert>;
}

// Mostrar en resumen
<Box>
  <Typography variant="caption">Médico</Typography>
  <Typography variant="body1">{medico.fullName}</Typography>
  <Typography variant="caption">{medico.especialidad}</Typography>
</Box>

// Limpiar al confirmar
sessionStorage.removeItem('selectedMedico');
```

---

## 📄 ARCHIVO NUEVO CREADO

### **src/pages/appointments/DoctorSelectionPage.tsx**

Página completa para selección de médico especialista.

**Características:**
- ✅ Filtra médicos por especialidad de la terapia
- ✅ Muestra cards con información completa
- ✅ Rating y pacientes atendidos
- ✅ Horarios de atención
- ✅ Selección visual con feedback
- ✅ Validación de terapia seleccionada

**Estructura:**
```typescript
export default function DoctorSelectionPage() {
  const navigate = useNavigate();
  const [selectedTerapia, setSelectedTerapia] = useState<Terapia | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);

  // Cargar terapia desde sessionStorage
  useEffect(() => {
    const terapiaStr = sessionStorage.getItem('selectedTerapia');
    if (terapiaStr) {
      setSelectedTerapia(JSON.parse(terapiaStr));
    } else {
      navigate('/terapias');
    }
  }, [navigate]);

  // Obtener médicos por especialidad
  const { data: medicos = [], isLoading } = useGetMedicosByEspecialidadQuery(
    selectedTerapia?.especialidad || '',
    { skip: !selectedTerapia }
  );

  const handleSelectMedico = (medico: Medico) => {
    setSelectedMedico(medico);
  };

  const handleContinuar = () => {
    if (selectedMedico) {
      sessionStorage.setItem('selectedMedico', JSON.stringify(selectedMedico));
      navigate('/calendario');
    }
  };

  // ... UI con cards de médicos
}
```

**Componentes UI:**
- Botón "Volver a Terapias"
- Card informativa con terapia seleccionada
- Grid de cards de médicos con:
  * Avatar con inicial del nombre
  * Nombre completo y especialidad
  * Número de licencia
  * Rating con estrellas
  * Pacientes atendidos
  * Horario de atención (días y horas)
  * Indicador visual de selección
- Botón "Continuar al Calendario" (deshabilitado si no hay selección)

---

## 🔗 RELACIÓN MÉDICO-TERAPIA

Los médicos están ligados a las terapias por el campo `especialidad`:

### Ejemplo de Terapia
```typescript
{
  id: 1,
  nombre: "Fisioterapia Deportiva",
  especialidad: "Fisioterapia",  // ← Campo clave
  duracion: 60,
  precio: 45.00,
  // ...
}
```

### Ejemplo de Médico
```typescript
{
  id: 1,
  fullName: "Dr. Carlos Mendoza",
  especialidad: "Fisioterapia",  // ← Debe coincidir
  numeroLicencia: "MED-12345",
  calificacion: 4.8,
  pacientesAtendidos: 245,
  horarioAtencion: [
    { diaSemana: 1, horaInicio: "08:00", horaFin: "16:00" },
    // ...
  ],
  // ...
}
```

### Query Utilizado
```typescript
useGetMedicosByEspecialidadQuery(terapia.especialidad)
```

Este query está implementado en `src/services/medicosApi.ts`:
```typescript
getMedicosByEspecialidad: builder.query<Medico[], string>({
  queryFn: async (especialidad) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const medicos = mockMedicos.filter(m => m.especialidad === especialidad);
    return { data: medicos };
  },
  providesTags: ['Medicos'],
}),
```

---

## 💾 GESTIÓN DE SESSIONSTORAGE

### Datos Almacenados

| Key | Tipo | Guardado en | Usado en | Limpiado en |
|-----|------|-------------|----------|-------------|
| `selectedTerapia` | Terapia | TherapySelectionPage | DoctorSelectionPage, CalendarPage, ConfirmationPage | ConfirmationPage |
| `selectedMedico` | Medico | DoctorSelectionPage | CalendarPage, ConfirmationPage | ConfirmationPage |
| `appointmentData` | AppointmentData | CalendarPage, AppointmentFormPage | AppointmentFormPage, ConfirmationPage | ConfirmationPage |

### Estructura de appointmentData
```typescript
{
  terapiaId: number,
  medicoId: number | string,
  fecha: string,        // "2026-05-15"
  hora: string,         // "10:00"
  sintomas: string,
  tieneExamenes: boolean,
  examenes: string[]
}
```

---

## ✅ VALIDACIONES IMPLEMENTADAS

### 1. En DoctorSelectionPage
- ✅ Verifica que exista terapia seleccionada
- ✅ Si no hay terapia, redirige a `/terapias`
- ✅ Muestra mensaje si no hay médicos disponibles para la especialidad
- ✅ Deshabilita botón "Continuar" si no hay médico seleccionado

### 2. En CalendarPage
- ✅ Verifica que existan terapia Y médico
- ✅ Si falta alguno, redirige a `/terapias`
- ✅ Filtra horarios solo del médico seleccionado
- ✅ Muestra mensaje si no hay horarios disponibles

### 3. En ConfirmationPage
- ✅ Verifica que existan terapia, médico y appointmentData
- ✅ Si falta alguno, muestra error y botón para volver

---

## 🎨 EXPERIENCIA DE USUARIO

### Navegación
```
[Terapias] 
    ↓ Selecciona terapia
[Selección de Médico]
    ← Volver a Terapias
    ↓ Selecciona médico
[Calendario]
    ← Volver a Selección de Médico
    ↓ Selecciona fecha y hora
[Formulario]
    ← Volver a Calendario
    ↓ Completa información médica
[Confirmación]
    ← Volver a Formulario
    ↓ Confirma cita
[Mis Citas]
```

### Feedback Visual
- **Terapia seleccionada:** Card con borde azul y check icon
- **Médico seleccionado:** Card con borde azul, fondo azul claro y check icon
- **Fecha seleccionada:** Botón con variant="contained"
- **Hora seleccionada:** Botón con variant="contained"

### Información Mostrada
- **En Selección de Médico:**
  * Terapia elegida (nombre, especialidad, duración, precio)
  * Lista de médicos disponibles
  * Por cada médico: nombre, especialidad, licencia, rating, pacientes, horarios

- **En Calendario:**
  * Terapia elegida
  * Médico elegido
  * Calendario de próximos 7 días
  * Horarios disponibles del médico

- **En Confirmación:**
  * Datos del paciente
  * Terapia, médico, fecha, hora, duración, precio
  * Información médica (síntomas, exámenes)

---

## 🧪 PRUEBAS RECOMENDADAS

### Flujo Completo
1. ✅ Login como paciente
2. ✅ Ir a "Reservar Cita"
3. ✅ Seleccionar una terapia (ej: Fisioterapia Deportiva)
4. ✅ Verificar que solo aparezcan médicos de esa especialidad
5. ✅ Seleccionar un médico
6. ✅ Verificar que el calendario muestre solo horarios de ese médico
7. ✅ Seleccionar fecha y hora
8. ✅ Completar formulario
9. ✅ Verificar que la confirmación muestre médico correcto
10. ✅ Confirmar cita

### Validaciones
1. ✅ Intentar acceder a `/seleccion-medico` sin terapia → Redirige a `/terapias`
2. ✅ Intentar acceder a `/calendario` sin médico → Redirige a `/terapias`
3. ✅ Intentar acceder a `/confirmacion` sin datos → Muestra error
4. ✅ Volver atrás en cada paso → Mantiene datos seleccionados
5. ✅ Confirmar cita → Limpia sessionStorage

### Casos Especiales
1. ✅ Terapia sin médicos disponibles → Muestra mensaje informativo
2. ✅ Médico sin horarios disponibles → Muestra mensaje informativo
3. ✅ Cambiar de terapia → Limpia médico seleccionado

---

## 📊 CREDENCIALES DE PRUEBA

### Paciente
- **Cédula:** `1234567890`
- **Contraseña:** `password123`

### Médicos Disponibles
1. **Dr. Carlos Mendoza**
   - Especialidad: Fisioterapia
   - Cédula: `1111111111`
   - Contraseña: `medico123`

2. **Dra. María González**
   - Especialidad: Terapia Ocupacional
   - Cédula: `0987654321`
   - Contraseña: `medico123`

3. **Dr. Roberto Silva**
   - Especialidad: Psicología
   - Cédula: `1122334455`
   - Contraseña: `medico123`

---

## 🚀 PRÓXIMOS PASOS (BACKEND)

### Endpoints Necesarios

1. **GET /api/medicos/especialidad/:especialidad**
   - Retorna médicos filtrados por especialidad
   - Incluye: id, fullName, especialidad, numeroLicencia, calificacion, pacientesAtendidos, horarioAtencion

2. **GET /api/horarios-disponibles**
   - Parámetros: terapiaId, medicoId, fecha
   - Retorna horarios disponibles del médico para esa fecha
   - Considera: duración de terapia, horarios del médico, citas existentes

3. **POST /api/citas**
   - Body: terapiaId, medicoId, pacienteId, fecha, hora, sintomas, tieneExamenes
   - Validaciones: anticipación 12h, doble reserva, disponibilidad
   - Retorna: cita creada con todos los datos

### Base de Datos

**Tabla medicos:**
```sql
CREATE TABLE medicos (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  especialidad VARCHAR(100),
  numero_licencia VARCHAR(50),
  calificacion DECIMAL(2,1),
  pacientes_atendidos INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Tabla horarios_atencion:**
```sql
CREATE TABLE horarios_atencion (
  id INT PRIMARY KEY,
  medico_id INT REFERENCES medicos(id),
  dia_semana INT,  -- 0=Domingo, 1=Lunes, etc.
  hora_inicio TIME,
  hora_fin TIME,
  created_at TIMESTAMP
);
```

**Tabla citas (actualizada):**
```sql
ALTER TABLE citas ADD COLUMN medico_id INT REFERENCES medicos(id);
```

---

## ✨ CONCLUSIÓN

El flujo de selección de médico ha sido implementado exitosamente, permitiendo una experiencia de usuario más completa y escalable. Los pacientes ahora pueden:

1. ✅ Elegir la terapia que necesitan
2. ✅ Ver y seleccionar médicos especializados en esa terapia
3. ✅ Reservar citas con el médico de su preferencia
4. ✅ Ver información completa del médico antes de reservar

El sistema está listo para ser conectado con el backend siguiendo las especificaciones documentadas.
