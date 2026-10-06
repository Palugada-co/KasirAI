import React from 'react'
import { AuthLayout } from '../features/auth/AuthLayout'
import { LoginForm } from '../features/auth/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Masuk ke Akun Kasir"
      subtitle="Kelola pesanan pelanggan dan operasional kasir dengan KasirAI"
    >
      <LoginForm />
    </AuthLayout>
  )
}
