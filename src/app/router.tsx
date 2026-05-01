/**
 * Configuración de Rutas
 * Basado en el documento de especificaciones técnicas
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleGuard from '../components/auth/RoleGuard';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { Box, CircularProgress } from '@mui/material';

// Lazy loading de páginas
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const TherapySelectionPage = lazy(() => import('../pages/therapies/TherapySelectionPage'));
const CalendarPage = lazy(() => import('../pages/appointments/CalendarPage'));
const AppointmentFormPage = lazy(() => import('../pages/appointments/AppointmentFormPage'));
const ConfirmationPage = lazy(() => import('../pages/appointments/ConfirmationPage'));
const MyCitasPage = lazy(() => import('../pages/citas/MyCitasPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

// Componente de loading
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    }}
  >
    <CircularProgress size={50} />
  </Box>
);

// Definición de rutas
export const ROUTES = {
  // Autenticación
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Terapias y citas
  TERAPIAS: '/terapias',
  CALENDARIO: '/calendario',
  FORMULARIO_CITA: '/formulario-cita',
  CONFIRMACION: '/confirmacion',
  MIS_CITAS: '/mis-citas',
  
  // Perfil
  PERFIL: '/perfil',
};

export const router = createBrowserRouter([
  // Rutas públicas
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  
  // Rutas protegidas
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
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.TERAPIAS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <TherapySelectionPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.CALENDARIO,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <CalendarPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.FORMULARIO_CITA,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <AppointmentFormPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.CONFIRMACION,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <ConfirmationPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.MIS_CITAS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <MyCitasPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.PERFIL,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
  
  // Ruta 404
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

export default router;
