import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthGuard } from '../features/auth/AuthGuard'
import { Loader2 } from 'lucide-react'

const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const CashierPage = lazy(() =>
  import('../pages/CashierPage').then((m) => ({ default: m.CashierPage }))
)
const InventoryPage = lazy(() =>
  import('../pages/InventoryPage').then((m) => ({ default: m.InventoryPage }))
)
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const AIAssistantPage = lazy(() =>
  import('../pages/AIAssistantPage').then((m) => ({ default: m.AIAssistantPage }))
)

const PageLoader = () => (
  <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      <span className="text-xs font-semibold text-zinc-500">Memuat KasirAI...</span>
    </div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <Navigate to="/cashier" replace />,
      },
      {
        path: '/cashier',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CashierPage />
          </Suspense>
        ),
      },
      {
        path: '/inventory',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InventoryPage />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: '/ai-assistant',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AIAssistantPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/cashier" replace />,
  },
])
