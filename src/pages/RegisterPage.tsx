import React from 'react'
import { AuthLayout } from '../features/auth/AuthLayout'
import { RegisterForm } from '../features/auth/RegisterForm'

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Daftar Toko / Kasir Baru"
      subtitle="Mulai kelola sistem POS modern Anda dalam hitungan menit"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
