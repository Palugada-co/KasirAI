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
const OCRBookkeepingPage = lazy(() =>
  import('../pages/OCRBookkeepingPage').then((m) => ({ default: m.OCRBookkeepingPage }))
)

const PageLoader = () => (
  <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <img src="/favicon.png" alt="PaluPay" className="w-10 h-10 object-contain animate-pulse" />
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
        <span className="text-xs font-semibold text-zinc-500">Memuat PaluPay...</span>
      </div>
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
        path: '/ocr-bookkeeping',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OCRBookkeepingPage />
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
