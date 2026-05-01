# 📁 ESTRUCTURA COMPLETA DEL PROYECTO

## 🌳 Árbol de Archivos

```
gestion-citas-medicas/
│
├── 📄 Archivos de Configuración
│   ├── .env                          # Variables de entorno
│   ├── .env.example                  # Ejemplo de variables
│   ├── .gitignore                    # Archivos ignorados por Git
│   ├── package.json                  # Dependencias y scripts
│   ├── tsconfig.json                 # Configuración TypeScript
│   ├── tsconfig.app.json             # Config TS para app
│   ├── tsconfig.node.json            # Config TS para Node
│   ├── vite.config.ts                # Configuración Vite
│   └── index.html                    # HTML principal
│
├── 📚 Documentación
│   ├── README.md                     # Documentación principal
│   ├── INICIO_RAPIDO.md              # Guía de inicio rápido
│   ├── RESUMEN_PROYECTO.md           # Resumen ejecutivo
│   ├── ADAPTACION_DOCUMENTO.md       # Cómo se adaptó el documento
│   ├── BACKEND_TECHNICAL_SPECIFICATION.md  # Especificaciones backend
│   └── ESPECIFICACIONES_TECNICAS_FRONTEND_GESTION_RIESGOS.md  # Doc original
│
├── 📁 public/                        # Assets estáticos
│   └── vite.svg                      # Logo de Vite
│
└── 📁 src/                           # Código fuente
    │
    ├── 📄 App.tsx                    # Componente principal
    ├── 📄 main.tsx                   # Punto de entrada
    ├── 📄 index.css                  # Estilos globales
    │
    ├── 📁 app/                       # Configuración de la aplicación
    │   ├── 📁 theme/                 # Sistema de estilos
    │   │   ├── colors.ts             # Paleta de colores médicos
    │   │   ├── typography.ts         # Configuración tipográfica
    │   │   └── index.ts              # Tema MUI completo
    │   ├── store.ts                  # Store de Redux
    │   ├── router.tsx                # Configuración de rutas
    │   └── axiosClient.ts            # Cliente HTTP con interceptores
    │
    ├── 📁 components/                # Componentes reutilizables
    │   ├── 📁 auth/                  # Componentes de autenticación
    │   │   ├── ProtectedRoute.tsx    # Protección de rutas
    │   │   └── RoleGuard.tsx         # Guard por roles
    │   └── 📁 layout/                # Componentes de layout
    │       └── MainLayout.tsx        # Layout principal con sidebar
    │
    ├── 📁 contexts/                  # Contextos React
    │   └── AuthContext.tsx           # Contexto de autenticación
    │
    ├── 📁 pages/                     # Páginas de la aplicación
    │   ├── 📁 auth/                  # Autenticación
    │   │   ├── LoginPage.tsx         # Página de login
    │   │   └── RegisterPage.tsx      # Página de registro
    │   ├── 📁 dashboard/             # Dashboard
    │   │   └── DashboardPage.tsx     # Dashboard principal
    │   ├── 📁 therapies/             # Terapias
    │   │   └── TherapySelectionPage.tsx  # Selección de terapias
    │   ├── 📁 appointments/          # Citas
    │   │   ├── CalendarPage.tsx      # Paso 1: Calendario
    │   │   ├── AppointmentFormPage.tsx   # Paso 2: Formulario
    │   │   └── ConfirmationPage.tsx  # Paso 3: Confirmación
    │   ├── 📁 citas/                 # Gestión de citas
    │   │   └── MyCitasPage.tsx       # Mis citas
    │   └── 📁 profile/               # Perfil
    │       └── ProfilePage.tsx       # Perfil de usuario
    │
    ├── 📁 services/                  # Servicios y APIs
    │   ├── authService.ts            # Servicio de autenticación
    │   ├── citasApi.ts               # API de citas (RTK Query)
    │   ├── terapiasApi.ts            # API de terapias (RTK Query)
    │   ├── medicosApi.ts             # API de médicos (RTK Query)
    │   └── 📁 mocks/                 # Datos mock
    │       ├── usuariosMock.ts       # Usuarios de prueba
    │       ├── medicosMock.ts        # Médicos mock
    │       ├── terapiasMock.ts       # Terapias mock
    │       └── citasMock.ts          # Citas mock
    │
    └── 📁 types/                     # Tipos TypeScript
        └── index.ts                  # Definiciones de tipos
```

---

## 📊 Estadísticas del Proyecto

### Archivos por Categoría

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| 📄 **Configuración** | 8 | package.json, tsconfig, vite.config, etc. |
| 📚 **Documentación** | 6 | README, especificaciones, guías |
| 🎨 **Tema y Estilos** | 4 | colors, typography, theme, index.css |
| 🔐 **Autenticación** | 4 | AuthContext, Login, Register, guards |
| 🧭 **Routing** | 1 | router.tsx |
| 📱 **Páginas** | 8 | Dashboard, Terapias, Citas, Perfil, etc. |
| 🔌 **Servicios** | 8 | APIs (RTK Query) + mocks |
| 🏗️ **Layout** | 1 | MainLayout |
| 📦 **Tipos** | 1 | index.ts |
| 🚀 **App** | 2 | App.tsx, main.tsx |

**Total: ~43 archivos**

---

## 🎯 Flujo de Archivos por Funcionalidad

### 1. Autenticación
```
LoginPage.tsx
    ↓
AuthContext.tsx (login)
    ↓
authService.ts (mock)
    ↓
usuariosMock.ts
    ↓
sessionStorage (JWT)
```

### 2. Reserva de Cita
```
TherapySelectionPage.tsx
    ↓
terapiasApi.ts (RTK Query)
    ↓
terapiasMock.ts
    ↓
CalendarPage.tsx
    ↓
citasApi.ts (getHorariosDisponibles)
    ↓
citasMock.ts
    ↓
AppointmentFormPage.tsx
    ↓
ConfirmationPage.tsx
    ↓
citasApi.ts (createCita)
    ↓
MyCitasPage.tsx
```

### 3. Dashboard
```
DashboardPage.tsx
    ↓
citasApi.ts (getProximasCitas)
    ↓
terapiasApi.ts (getTerapias)
    ↓
citasMock.ts + terapiasMock.ts
    ↓
Renderizado de estadísticas
```

---

## 🔄 Dependencias entre Archivos

### Configuración Base
```
main.tsx
  ├── App.tsx
  │   ├── theme/index.ts
  │   │   ├── colors.ts
  │   │   └── typography.ts
  │   ├── store.ts
  │   │   ├── citasApi.ts
  │   │   ├── terapiasApi.ts
  │   │   └── medicosApi.ts
  │   ├── router.tsx
  │   │   ├── MainLayout.tsx
  │   │   └── [Todas las páginas]
  │   └── AuthContext.tsx
  │       └── authService.ts
  └── index.css
```

### Rutas Protegidas
```
router.tsx
  ├── ProtectedRoute.tsx
  │   └── AuthContext.tsx
  └── RoleGuard.tsx
      └── AuthContext.tsx
```

### APIs (RTK Query)
```
store.ts
  ├── citasApi.ts
  │   └── citasMock.ts
  ├── terapiasApi.ts
  │   └── terapiasMock.ts
  └── medicosApi.ts
      └── medicosMock.ts
```

---

## 📦 Módulos Principales

### 1. **app/** - Configuración
- **Propósito:** Configuración global de la aplicación
- **Archivos clave:**
  - `theme/` - Sistema de estilos MUI
  - `store.ts` - Redux store
  - `router.tsx` - Rutas
  - `axiosClient.ts` - HTTP client

### 2. **components/** - Componentes Reutilizables
- **Propósito:** Componentes compartidos
- **Archivos clave:**
  - `auth/` - Protección de rutas
  - `layout/` - Layout principal

### 3. **contexts/** - Contextos React
- **Propósito:** Estado global con Context API
- **Archivos clave:**
  - `AuthContext.tsx` - Autenticación

### 4. **pages/** - Páginas
- **Propósito:** Vistas de la aplicación
- **Archivos clave:**
  - `auth/` - Login y registro
  - `dashboard/` - Dashboard
  - `therapies/` - Terapias
  - `appointments/` - Flujo de citas
  - `citas/` - Gestión de citas
  - `profile/` - Perfil

### 5. **services/** - Servicios
- **Propósito:** Lógica de negocio y APIs
- **Archivos clave:**
  - `authService.ts` - Autenticación
  - `*Api.ts` - APIs con RTK Query
  - `mocks/` - Datos de prueba

### 6. **types/** - Tipos TypeScript
- **Propósito:** Definiciones de tipos
- **Archivos clave:**
  - `index.ts` - Todos los tipos

---

## 🎨 Sistema de Tema

### Jerarquía de Estilos
```
theme/index.ts (Tema MUI)
  ├── colors.ts (Paleta de colores)
  │   ├── primary (Azul médico)
  │   ├── secondary (Verde salud)
  │   ├── appointment (Estados de citas)
  │   ├── priority (Prioridades)
  │   └── specialty (Especialidades)
  ├── typography.ts (Tipografía)
  │   ├── fontFamily (Roboto)
  │   ├── fontSize (14px base)
  │   └── variants (h1-h6, body, button)
  └── components (Personalizaciones MUI)
      ├── MuiButton
      ├── MuiCard
      ├── MuiTextField
      └── ...
```

---

## 🔐 Flujo de Autenticación

```
Usuario ingresa credenciales
    ↓
LoginPage.tsx (validación Zod)
    ↓
AuthContext.login()
    ↓
authService.login() (mock)
    ↓
usuariosMock.ts (verificación)
    ↓
Generar JWT mock
    ↓
sessionStorage.setItem('auth_token')
    ↓
AuthContext.setUser()
    ↓
router.tsx (redirección)
    ↓
ProtectedRoute (verificación)
    ↓
MainLayout.tsx
    ↓
DashboardPage.tsx
```

---

## 🗄️ Flujo de Datos (Redux)

```
Componente
    ↓
useGetCitasQuery() (RTK Query hook)
    ↓
citasApi.ts (endpoint)
    ↓
citasMock.ts (datos mock)
    ↓
Cache de Redux
    ↓
Componente (re-render)
```

---

## 📱 Responsive Design

### Breakpoints
```
xs: 0px - 599px    (Móvil)
sm: 600px - 899px  (Tablet)
md: 900px - 1199px (Desktop pequeño)
lg: 1200px+        (Desktop)
```

### Adaptaciones
```
MainLayout.tsx
  ├── xs-sm: Drawer temporal (hamburger menu)
  └── md+: Drawer permanente (sidebar fijo)

Grid de Cards
  ├── xs: 1 columna
  ├── sm: 2 columnas
  └── md+: 3-4 columnas
```

---

## 🎯 Puntos de Entrada

### Para Desarrollo
1. **Inicio:** `src/main.tsx`
2. **Rutas:** `src/app/router.tsx`
3. **Tema:** `src/app/theme/index.ts`
4. **Auth:** `src/contexts/AuthContext.tsx`

### Para Personalización
1. **Colores:** `src/app/theme/colors.ts`
2. **Datos Mock:** `src/services/mocks/`
3. **Rutas:** `src/app/router.tsx`
4. **Tipos:** `src/types/index.ts`

---

## 📚 Archivos de Documentación

| Archivo | Propósito | Audiencia |
|---------|-----------|-----------|
| `README.md` | Documentación completa | Desarrolladores |
| `INICIO_RAPIDO.md` | Guía de inicio | Nuevos usuarios |
| `RESUMEN_PROYECTO.md` | Resumen ejecutivo | Stakeholders |
| `ADAPTACION_DOCUMENTO.md` | Cómo se adaptó | Arquitectos |
| `BACKEND_TECHNICAL_SPECIFICATION.md` | Especificaciones backend | Backend devs |
| `ESTRUCTURA_PROYECTO.md` | Este archivo | Todos |

---

## 🚀 Comandos Rápidos

```bash
# Ver estructura de archivos
tree src/

# Contar líneas de código
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Buscar en el código
grep -r "AuthContext" src/

# Ver dependencias
npm list --depth=0
```

---

**Estructura completa y organizada para un desarrollo profesional** ✨
