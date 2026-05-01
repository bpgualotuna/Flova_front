# ESPECIFICACIONES TÉCNICAS DEL FRONTEND - SISTEMA DE GESTIÓN DE RIESGOS

## ÍNDICE
1. [Arquitectura General](#1-arquitectura-general)
2. [Tecnologías y Dependencias](#2-tecnologías-y-dependencias)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Sistema de Autenticación y Sesiones](#4-sistema-de-autenticación-y-sesiones)
5. [Sistema de Routing y Navegación](#5-sistema-de-routing-y-navegación)
6. [Sistema de Estilos y Diseño](#6-sistema-de-estilos-y-diseño)
7. [Componentes y Patrones de UI](#7-componentes-y-patrones-de-ui)
8. [Gestión de Estado](#8-gestión-de-estado)
9. [Integración con Backend](#9-integración-con-backend)
10. [Guía de Replicación](#10-guía-de-replicación)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Stack Tecnológico Principal
- **Framework**: React 19.2.0 con TypeScript
- **Build Tool**: Vite 6.3.5
- **Lenguaje**: TypeScript 5.9.3
- **UI Framework**: Material-UI (MUI) v7.3.7
- **Estado Global**: Redux Toolkit 2.11.2 + React Redux 9.2.0
- **Routing**: React Router DOM 7.13.0
- **HTTP Client**: Axios 1.13.3
- **Validación de Formularios**: React Hook Form 7.71.1 + Zod 4.3.6
- **Gráficos**: Recharts 3.7.0
- **Notificaciones**: SweetAlert2 11.26.24

### 1.2 Patrón Arquitectónico
- **Arquitectura**: Component-Based Architecture con Context API
- **Patrón de Estado**: Context + Redux para estado global
- **Patrón de Datos**: RTK Query para gestión de datos del servidor
- **Patrón de Navegación**: Layout-based routing con lazy loading

### 1.3 Estructura de Capas
```
App Layer (App.tsx)
├── Providers Layer (Theme, Redux, Auth, Router)
├── Layout Layer (MainLayout.tsx)
├── Pages Layer (Lazy-loaded pages)
├── Features Layer (Contextos específicos)
└── Services Layer (API calls, utilities)
```

---

## 2. TECNOLOGÍAS Y DEPENDENCIAS

### 2.1 Dependencias Principales (package.json)
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@hookform/resolvers": "^5.2.2",
    "@mui/icons-material": "^7.3.7",
    "@mui/lab": "7.0.1-beta.21",
    "@mui/material": "^7.3.7",
    "@mui/x-data-grid": "^8.26.0",
    "@reduxjs/toolkit": "^2.11.2",
    "axios": "^1.13.3",
    "json5": "^2.2.3",
    "lowdb": "^7.0.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.1",
    "react-markdown": "^10.1.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.13.0",
    "recharts": "^3.7.0",
    "sweetalert2": "^11.26.24",
    "zod": "^4.3.6"
  }
}
```

### 2.2 Scripts de Desarrollo
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:check": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview",
    "start": "vite preview --host 0.0.0.0 --port 3000",
    "migrar": "node scripts/migrar-datos-completo.js",
    "verificar": "node verificar-servidor.js"
  }
}
```

---

## 3. ESTRUCTURA DEL PROYECTO

### 3.1 Directorio Principal
```
gestion-riesgos-app/
├── src/
│   ├── admin/                    # Módulo de administración
│   ├── api/                      # Servicios API
│   ├── app/                      # Configuración de la app
│   │   ├── theme/               # Sistema de estilos
│   │   │   ├── colors.ts        # Paleta de colores
│   │   │   ├── typography.ts    # Configuración tipográfica
│   │   │   └── index.ts         # Tema MUI
│   │   ├── store.ts             # Store de Redux
│   │   ├── router.tsx           # Configuración de rutas
│   │   └── axiosClient.ts       # Cliente HTTP
│   ├── components/              # Componentes reutilizables
│   │   ├── auth/                # Componentes de autenticación
│   │   ├── common/              # Componentes comunes
│   │   ├── dashboard/           # Componentes de dashboard
│   │   ├── layout/              # Componentes de layout
│   │   └── profile/             # Componentes de perfil
│   ├── contexts/                # Contextos React
│   │   ├── AuthContext.tsx      # Contexto de autenticación
│   │   ├── ProcesoContext.tsx   # Contexto de procesos
│   │   └── RiesgoContext.tsx    # Contexto de riesgos
│   ├── hooks/                   # Custom hooks
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── auth/                # Páginas de autenticación
│   │   ├── dashboard/           # Páginas de dashboard
│   │   ├── admin/               # Páginas de administración
│   │   └── procesos/            # Páginas de procesos
│   ├── services/                # Servicios de negocio
│   ├── store/                   # Slices de Redux
│   ├── types/                   # Tipos TypeScript
│   ├── utils/                   # Utilidades
│   ├── App.tsx                  # Componente principal
│   └── main.tsx                 # Punto de entrada
├── public/                      # Assets estáticos
└── package.json                 # Dependencias
```

### 3.2 Configuración de TypeScript
- **tsconfig.json**: Configuración estándar de React + TypeScript
- **tsconfig.app.json**: Configuración específica para la aplicación
- **tsconfig.node.json**: Configuración para Node.js

---

## 4. SISTEMA DE AUTENTICACIÓN Y SESIONES

### 4.1 Modelo de Usuario
```typescript
export interface User {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;                // 'admin' | 'dueño_procesos' | 'gerente' | 'supervisor' | 'gerente_general' | 'manager'
  department: string;
  avatar?: string;
  fotoPerfil?: string | null;
  phone?: string;
  position: string;
  esDuenoProcesos?: boolean;
  gerenteMode?: GerenteModo | null;  // 'dueño' | 'supervisor'
  ambito?: AmbitoRol;            // 'SISTEMA' | 'OPERATIVO'
  puedeVisualizar?: boolean;
  puedeEditar?: boolean;
}
```

### 4.2 Roles y Permisos
- **Administrador**: Acceso completo al sistema, ámbito SISTEMA
- **Dueño de Procesos**: Gestión de procesos y riesgos asignados
- **Gerente**: Modo dual (dueño/supervisor)
- **Supervisor**: Revisión y validación de procesos
- **Gerente General**: Acceso como director o usuario de proceso

### 4.3 Contexto de Autenticación (AuthContext.tsx)
#### Funcionalidades Principales:
1. **Gestión de Estado de Sesión**: `user`, `isAuthenticated`, `isLoading`
2. **Métodos de Autenticación**: `login()`, `logout()`, `refreshUser()`
3. **Gestión de Modos**: `gerenteMode`, `setGerenteMode()`
4. **Validación de Roles**: Helpers como `esAdmin`, `esDueñoProcesos`, etc.
5. **Persistencia**: JWT en sessionStorage

#### Flujo de Login:
```typescript
// 1. Usuario ingresa credenciales
// 2. Llamada a API /auth/login
// 3. Validación de 2FA (si aplica)
// 4. Almacenamiento de token JWT
// 5. Redirección según rol y ámbito
```

### 4.4 Protección de Rutas
#### Componente ProtectedRoute:
- Verifica autenticación antes de renderizar rutas
- Maneja estados de carga
- Redirige a /login si no est�� autenticado

#### Componente RoleGuard:
- Verifica roles específicos para acceder a rutas
- Implementa lazy loading para mejor performance

### 4.5 Gestión de Sesiones
- **Token JWT**: Almacenado en sessionStorage (AUTH_TOKEN_KEY)
- **Restauración Automática**: Al montar la app, verifica token válido
- **Expiración**: Evento 'auth:session-expired' para manejar tokens inválidos
- **Cierre de Sesión**: Limpia sessionStorage y estado local

---

## 5. SISTEMA DE ROUTING Y NAVEGACIÓN

### 5.1 Configuración de Router (router.tsx)
#### Características:
- **Lazy Loading**: Todas las páginas cargan dinámicamente
- **Protected Routes**: Rutas protegidas por autenticación
- **Role-based Routing**: Acceso basado en roles
- **Error Handling**: Manejo centralizado de errores
- **Nested Routes**: Layout principal con rutas hijas

#### Estructura de Rutas:
```typescript
export const ROUTES = {
  // Autenticación
  LOGIN: '/login',
  MODO_GERENTE_GENERAL: '/modo-gerente-general',
  
  // Dashboard y principales
  DASHBOARD: '/dashboard',
  DASHBOARD_SUPERVISOR: '/dashboard-supervisor',
  DASHBOARD_GERENTE_GENERAL: '/dashboard-gerente-general',
  
  // Procesos
  PROCESOS: '/procesos',
  FICHA: '/ficha',
  ANALISIS_PROCESO: '/analisis-proceso',
  
  // Riesgos
  IDENTIFICACION: '/identificacion',
  MAPA: '/mapa',
  PRIORIZACION: '/priorizacion',
  
  // Administración
  ADMINISTRACION: '/administracion',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_PROCESOS: '/admin/procesos',
  ADMIN_AREAS: '/admin/areas',
  ADMIN_CONFIGURACION: '/admin/configuracion',
  
  // Otros
  HISTORIAL: '/historial',
  AYUDA: '/ayuda'
};
```

### 5.2 Layout Principal (MainLayout.tsx)
#### Componentes:
1. **AppBar Superior**: Logo, selector de proceso, perfil de usuario
2. **Sidebar Navegable**: Menú colapsable con iconos
3. **Contenido Principal**: Área donde se renderizan las páginas
4. **Responsive Design**: Adaptación móvil/desktop

#### Características del Sidebar:
- **Colapsable**: Guarda estado en localStorage
- **Iconos Coloridos**: Cada sección tiene color distintivo
- **Submenús Anidados**: Menús expandibles con transiciones
- **Filtrado por Rol**: Muestra solo opciones permitidas
- **Estado Activo**: Resalta la ruta actual

### 5.3 Selector de Proceso
- **Autocomplete**: Búsqueda y selección de procesos
- **Modo Visualización/Edición**: Selector de modo según estado del proceso
- **Validación**: Procesos aprobados solo pueden ser editados por dueños
- **Persistencia**: Estado guardado en contexto

---

## 6. SISTEMA DE ESTILOS Y DISEÑO

### 6.1 Paleta de Colores (colors.ts)
#### Colores Corporativos COMWARE:
```typescript
export const colors = {
  primary: {
    main: "#1976d2",     // Azul profesional
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#424242",     // Gris oscuro profesional
    light: "#616161",
    dark: "#212121",
    contrastText: "#FFFFFF",
  },
  
  // Niveles de Riesgo (Semáforo)
  risk: {
    critical: { main: "#d32f2f" },  // Rojo
    high: { main: "#f57c00" },       // Naranja
    medium: { main: "#fbc02d" },    // Ámbar
    low: { main: "#388e3c" },        // Verde
  },
  
  // Fondos y Textos
  background: {
    default: "#F0F2F5",  // Gris claro para fondo exterior
    paper: "#FFFFFF",    // Blanco para contenido
    elevated: "#FFFFFF",
  },
  
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.60)",
    com: "#585858",      // Gris oscuro del COM
    ware: "#707070",     // Gris claro del WARE
  }
};
```

### 6.2 Tema Material-UI (theme/index.ts)
#### Configuración:
- **Modo**: Siempre light (no soporta dark mode)
- **Breakpoints**: Estándar Material-UI
- **Border Radius**: 8px uniforme
- **Spacing**: Base de 8px

#### Personalizaciones de Componentes:
```typescript
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',  // Sin mayúsculas
        fontWeight: 600,
      },
      contained: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
}
```

### 6.3 Tipografía (typography.ts)
- **Font Family**: Roboto, sistema, sans-serif
- **Font Sizes**: Escala jerárquica estándar
- **Font Weights**: 300, 400, 500, 700
- **Line Heights**: Optimizados para legibilidad

### 6.4 Variables CSS (variables.css)
#### Variables Personalizadas:
```css
:root {
  /* Colores de marca COMWARE */
  --color-primary-orange: #FFA500;
  --color-primary-lime: #C8D900;
  --color-primary-blue: #00BFFF;
  --color-primary-blue-dark: #0066CC;
  
  /* Colores de riesgo */
  --color-risk-critical: #D32F2F;
  --color-risk-high: #F57C00;
  --color-risk-medium: #FBC02D;
  --color-risk-low: #388E3C;
  
  /* Espaciado */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

---

## 7. COMPONENTES Y PATRONES DE UI

### 7.1 Patrones de Componentes Comunes

#### 7.1.1 Card Patterns
```typescript
// MetricCard - Para métricas del dashboard
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

// DataGrid Card - Para tablas de datos
// Utiliza @mui/x-data-grid con estilos personalizados
```

#### 7.1.2 Form Patterns
- **React Hook Form**: Para validación de formularios
- **Zod**: Para esquemas de validación
- **MUI TextField**: Con estilos personalizados
- **AutoComplete**: Para búsquedas con opciones

#### 7.1.3 Dialog Patterns
- **PerfilDialog**: Para edición de perfil
- **ConfirmationDialog**: Para confirmaciones
- **PhotoUpdateFlow**: Para actualización de fotos

### 7.2 Sistema de Iconos
- **Material Icons**: @mui/icons-material
- **Iconos Personalizados**: Según necesidad
- **Colores por Sección**: Iconos del sidebar con colores específicos

### 7.3 Responsive Design
#### Breakpoints:
- **xs**: 0px - 599px (Móvil)
- **sm**: 600px - 899px (Tablet)
- **md**: 900px - 1199px (Desktop pequeño)
- **lg**: 1200px - 1535px (Desktop)
- **xl**: 1536px+ (Desktop grande)

#### Adaptaciones:
- **AppBar**: 2 líneas en móvil, 1 línea en desktop
- **Sidebar**: Drawer temporal en móvil, permanente en desktop
- **Contenido**: Padding ajustado por breakpoint

---

## 8. GESTIÓN DE ESTADO

### 8.1 Arquitectura de Estado
```
Estado Global (Redux)
├── API Slices (RTK Query)
│   ├── riesgosApi
│   └── planTrazabilidadApi
└── Feature Slices
    └── riesgoSlice

Estado Local (Context API)
├── AuthContext (Autenticación)
├── ProcesoContext (Procesos)
├── RiesgoContext (Riesgos)
└── Otros contextos específicos
```

### 8.2 Contextos React

#### 8.2.1 AuthContext
- **Propósito**: Gestión centralizada de autenticación
- **Estado**: usuario, token, roles, modos
- **Métodos**: login, logout, refresh, mode switching

#### 8.2.2 ProcesoContext
- **Propósito**: Gestión del proceso seleccionado
- **Estado**: procesoSeleccionado, modoProceso
- **Métodos**: seleccionar, cambiar modo, limpiar

#### 8.2.3 RiesgoContext
- **Propósito**: Gestión de riesgos seleccionados
- **Estado**: riesgoSeleccionado, modo
- **Métodos**: seleccionar, limpiar, validar

### 8.3 Redux Store
```typescript
export const store = configureStore({
  reducer: {
    [riesgosApi.reducerPath]: riesgosApi.reducer,
    [planTrazabilidadApi.reducerPath]: planTrazabilidadApi.reducer,
    riesgo: riesgoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(riesgosApi.middleware)
      .concat(planTrazabilidadApi.middleware),
});
```

### 8.4 RTK Query
- **Ventaja**: Cache automática, re-fetching, polling
- **Configuración**: Endpoints definidos en servicios API
- **Uso**: Hooks generados automáticamente

---

## 9. INTEGRACIÓN CON BACKEND

### 9.1 Configuración de API
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### 9.2 Servicios API
#### 9.2.1 Auth Service
```typescript
// Endpoints principales
POST /auth/login          // Login de usuario
GET  /auth/me             // Obtener información del usuario
PATCH /auth/me            // Actualizar perfil
POST /auth/logout         // Cerrar sesión
```

#### 9.2.2 Riesgos Service
```typescript
// Endpoints para gestión de riesgos
GET    /riesgos           // Listar riesgos
POST   /riesgos           // Crear riesgo
PUT    /riesgos/:id       // Actualizar riesgo
DELETE /riesgos/:id       // Eliminar riesgo
```

#### 9.2.3 Planes Service
```typescript
// Endpoints para planes de acción
GET    /planes            // Listar planes
POST   /planes            // Crear plan
PUT    /planes/:id        // Actualizar plan
```

### 9.3 Cliente HTTP (axiosClient.ts)
#### Características:
- **Interceptores**: Para agregar token JWT automáticamente
- **Manejo de Errores**: Centralizado
- **Timeouts**: Configurables
- **Content-Type**: application/json por defecto

### 9.4 Manejo de Tokens JWT
```typescript
// Agregar token a las solicitudes
const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// Manejar errores de autenticación
if (error.response?.status === 401) {
  window.dispatchEvent(new Event('auth:session-expired'));
}
```

---

## 10. GUÍA DE REPLICACIÓN

### 10.1 Inicialización del Proyecto

#### Paso 1: Crear proyecto React con TypeScript
```bash
npm create vite@latest nuevo-proyecto-riesgos -- --template react-ts
cd nuevo-proyecto-riesgos
```

#### Paso 2: Instalar dependencias principales
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-data-grid @mui/lab
npm install react-router-dom axios
npm install @reduxjs/toolkit react-redux
npm install react-hook-form @hookform/resolvers zod
npm install recharts sweetalert2
```

#### Paso 3: Configurar estructura de carpetas
```
src/
├── app/
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── store.ts
│   ├── router.tsx
│   └── axiosClient.ts
├── components/
│   ├── auth/
│   ├── common/
│   ├── layout/
│   └── profile/
├── contexts/
├── hooks/
├── pages/
├── services/
├── store/
├── types/
└── utils/
```

### 10.2 Configuración del Tema

#### colors.ts - Paleta personalizada
```typescript
export const colors = {
  primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
  secondary: { main: "#424242", light: "#616161", dark: "#212121" },
  background: { default: "#F0F2F5", paper: "#FFFFFF", elevated: "#FFFFFF" },
  // ... agregar según necesidades
};
```

#### theme/index.ts - Configuración MUI
```typescript
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
  },
  typography,
  shape: { borderRadius: 8 },
  spacing: 8,
  // ... personalizaciones de componentes
});
```

### 10.3 Sistema de Autenticación

#### AuthContext.tsx - Implementación básica
```typescript
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string | number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  // ... otros campos según necesidades
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementar métodos login, logout, etc.
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### 10.4 Sistema de Routing

#### router.tsx - Configuración básica
```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';

// Lazy loading de páginas
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
// ... otras páginas

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <DashboardPage />
          </Suspense>
        ),
      },
      // ... otras rutas
    ],
  },
]);
```

### 10.5 Layout Principal

#### MainLayout.tsx - Estructura básica
```typescript
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Drawer } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar Superior */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Logo, selector de proceso, perfil de usuario */}
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Drawer variant="permanent">
        {/* Menú de navegación */}
      </Drawer>
      
      {/* Contenido Principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
```

### 10.6 Configuración de Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Sistema de Gestión de Riesgos
# ... otras variables según necesidades
```

### 10.7 Scripts de Build y Desarrollo
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

---

## CONCLUSIÓN

Este documento proporciona una guía completa para replicar el frontend del sistema de gestión de riesgos. La arquitectura está diseñada para ser:

1. **Modular**: Componentes reutilizables y desacoplados
2. **Escalable**: Fácil de extender con nuevas funcionalidades
3. **Mantenible**: Código organizado y documentado
4. **Seguro**: Sistema de autenticación robusto
5. **Responsive**: Diseño adaptable a todos los dispositivos

### Puntos Clave para Personalización:
1. **Paleta de Colores**: Modificar `colors.ts` para nueva identidad visual
2. **Roles y Permisos**: Adaptar `AuthContext.tsx` para nuevos roles
3. **Estructura de Menú**: Modificar `menuConfig.tsx` para nuevas secciones
4. **Integración API**: Actualizar servicios en `/src/api/` para nuevo backend
5. **Componentes UI**: Crear nuevos componentes en `/src/components/` según necesidades

### Consideraciones para Nueva Empresa:
- **Branding**: Actualizar logo, colores y tipografía
- **Flujos de Negocio**: Adaptar procesos específicos de la empresa
- **Integraciones**: Conectar con sistemas existentes de la empresa
- **Reportes**: Personalizar dashboards y métricas según necesidades

Este sistema proporciona una base sólida que puede ser adaptada para cualquier empresa que requiera un sistema de gestión de riesgos robusto y profesional.