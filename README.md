# Sistema de Gestión Médica - Frontend

Sistema profesional de gestión de pacientes y citas médicas desarrollado con React + TypeScript, Material-UI y Redux Toolkit.

## 🏥 Características

- ✅ **Autenticación completa** con login y registro
- ✅ **Gestión de citas médicas** con flujo de 3 pasos
- ✅ **Selección de terapias** con cards visuales
- ✅ **Calendario de disponibilidad** de médicos
- ✅ **Formulario médico** con síntomas y exámenes
- ✅ **Dashboard interactivo** con estadísticas
- ✅ **Gestión de perfil** de usuario
- ✅ **Sistema de roles** (Paciente, Médico, Admin)
- ✅ **Diseño responsive** adaptado a móviles y desktop
- ✅ **Datos mock** para pruebas sin backend

## 🎨 Arquitectura

Este proyecto está basado en las especificaciones técnicas del documento `ESPECIFICACIONES_TECNICAS_FRONTEND_GESTION_RIESGOS.md`, adaptado al dominio médico:

### Stack Tecnológico
- **React 19.2.0** con TypeScript
- **Vite 6.3.5** como build tool
- **Material-UI (MUI) 7.3.7** para componentes UI
- **Redux Toolkit 2.11.2** + RTK Query para estado global
- **React Router DOM 7.13.0** para navegación
- **React Hook Form 7.71.1** + Zod 4.3.6 para formularios
- **Axios 1.13.3** para peticiones HTTP
- **SweetAlert2 11.26.24** para notificaciones

### Estructura del Proyecto
```
src/
├── app/                      # Configuración de la aplicación
│   ├── theme/               # Sistema de estilos MUI
│   │   ├── colors.ts        # Paleta de colores médicos
│   │   ├── typography.ts    # Configuración tipográfica
│   │   └── index.ts         # Tema MUI completo
│   ├── store.ts             # Store de Redux
│   ├── router.tsx           # Configuración de rutas
│   └── axiosClient.ts       # Cliente HTTP con interceptores
├── components/              # Componentes reutilizables
│   ├── auth/                # Componentes de autenticación
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   └── layout/              # Componentes de layout
│       └── MainLayout.tsx   # Layout principal con sidebar
├── contexts/                # Contextos React
│   └── AuthContext.tsx      # Contexto de autenticación
├── pages/                   # Páginas de la aplicación
│   ├── auth/                # Login y Registro
│   ├── dashboard/           # Dashboard principal
│   ├── therapies/           # Selección de terapias
│   ├── appointments/        # Flujo de reserva de citas
│   ├── citas/               # Gestión de citas
│   └── profile/             # Perfil de usuario
├── services/                # Servicios API (RTK Query)
│   ├── authService.ts       # Servicio de autenticación
│   ├── citasApi.ts          # API de citas
│   ├── terapiasApi.ts       # API de terapias
│   ├── medicosApi.ts        # API de médicos
│   └── mocks/               # Datos mock para desarrollo
├── types/                   # Tipos TypeScript
│   └── index.ts             # Definiciones de tipos
└── utils/                   # Utilidades
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ y npm/yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd gestion-citas-medicas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` si es necesario:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Sistema de Gestión Médica
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Compilar para producción
npm run build:check  # Compilar con verificación de tipos
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar linter
```

## 👤 Credenciales de Prueba

### Paciente
- **Usuario:** 1234567890
- **Contraseña:** password123

### Administrador
- **Usuario:** admin
- **Contraseña:** admin123

## 🎯 Flujo de Usuario (Paciente)

1. **Login/Registro**
   - Iniciar sesión con cédula y contraseña
   - O registrarse como nuevo paciente

2. **Dashboard**
   - Ver próximas citas
   - Estadísticas rápidas
   - Accesos directos

3. **Reservar Cita**
   - **Paso 1:** Seleccionar terapia
   - **Paso 2:** Elegir fecha y hora en calendario
   - **Paso 3:** Completar formulario médico (síntomas, exámenes)
   - **Paso 4:** Confirmar y crear cita

4. **Gestionar Citas**
   - Ver todas las citas (próximas, completadas, canceladas)
   - Cancelar citas pendientes
   - Ver detalles de cada cita

5. **Perfil**
   - Ver información personal
   - Actualizar datos de contacto

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primary:** #2196F3 (Azul médico profesional)
- **Secondary:** #00897B (Verde salud)
- **Estados de Citas:**
  - Pendiente: #FFA726 (Naranja)
  - Confirmada: #66BB6A (Verde)
  - Completada: #42A5F5 (Azul)
  - Cancelada: #EF5350 (Rojo)

### Componentes Principales
- **Cards:** Diseño elevado con sombras suaves
- **Botones:** Bordes redondeados, sin mayúsculas
- **Formularios:** Validación con Zod y React Hook Form
- **Notificaciones:** SweetAlert2 para mensajes importantes

## 📱 Responsive Design

El sistema está completamente adaptado para:
- 📱 **Móviles** (xs: 0-599px)
- 📱 **Tablets** (sm: 600-899px)
- 💻 **Desktop** (md: 900px+)

## 🔐 Autenticación y Seguridad

- **JWT Tokens** almacenados en sessionStorage
- **ProtectedRoute** para rutas privadas
- **RoleGuard** para control de acceso por roles
- **Interceptores Axios** para agregar tokens automáticamente
- **Manejo de sesiones expiradas** con redirección automática

## 🗂️ Gestión de Estado

### Redux Toolkit + RTK Query
- **citasApi:** Gestión de citas (CRUD, horarios disponibles)
- **terapiasApi:** Catálogo de terapias
- **medicosApi:** Información de médicos

### Context API
- **AuthContext:** Autenticación y usuario actual

## 📄 Documentación Backend

Ver `BACKEND_TECHNICAL_SPECIFICATION.md` para especificaciones completas del backend necesario, incluyendo:
- Modelos de datos
- Endpoints de la API
- Autenticación JWT
- Reglas de negocio
- Validaciones

## 🔄 Datos Mock

El sistema incluye datos mock completos para desarrollo sin backend:
- 3 médicos con diferentes especialidades
- 6 terapias con imágenes
- Horarios disponibles generados dinámicamente
- Sistema de autenticación simulado

## 🛠️ Tecnologías y Patrones

### Patrones Implementados
- **Component-Based Architecture**
- **Context API** para estado global de autenticación
- **RTK Query** para cache y sincronización de datos
- **Lazy Loading** de páginas para mejor performance
- **Protected Routes** con guards de autenticación y roles
- **Form Validation** con Zod schemas
- **Responsive Design** con Material-UI breakpoints

### Mejores Prácticas
- ✅ TypeScript estricto para type safety
- ✅ Componentes funcionales con hooks
- ✅ Separación de concerns (UI, lógica, datos)
- ✅ Código modular y reutilizable
- ✅ Manejo centralizado de errores
- ✅ Validación de formularios robusta

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🤝 Contribución

Este proyecto fue generado siguiendo las especificaciones técnicas del documento base, adaptado al dominio de gestión médica.

## 📝 Notas Importantes

1. **Datos Mock:** El sistema actualmente usa datos simulados. Para producción, conectar con el backend según `BACKEND_TECHNICAL_SPECIFICATION.md`

2. **Imágenes de Terapias:** Las URLs de imágenes apuntan a Unsplash. Para producción, usar imágenes propias.

3. **Validaciones:** Todas las validaciones están implementadas en el frontend. El backend debe implementar las mismas validaciones.

4. **Roles:** El sistema soporta 3 roles (paciente, médico, admin). Actualmente solo el flujo de paciente está completamente implementado.

## 🎓 Frase Inspiradora

> "Lo importante no es poder, lo importante es intentar"

---

**Desarrollado con ❤️ siguiendo arquitectura profesional y mejores prácticas**
