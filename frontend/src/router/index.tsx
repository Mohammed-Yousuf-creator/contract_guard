import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ContractsPage } from '@/pages/ContractsPage';
import { ContractDetailPage } from '@/pages/ContractDetailPage';
import { UploadPage } from '@/pages/UploadPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { authService } from '@/services/auth.service';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/contracts',
        element: <ContractsPage />,
      },
      {
        path: '/contracts/:id',
        element: <ContractDetailPage />,
      },
      {
        path: '/upload',
        element: <UploadPage />,
      },
      {
        path: '/alerts',
        element: <AlertsPage />,
      },
      {
        path: '/reports',
        element: <ReportsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
