import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore'

export const AuthGuard: React.FC = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
