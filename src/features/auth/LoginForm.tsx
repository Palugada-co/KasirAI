import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, LogIn, UserCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/useUserStore'
import { useToast } from '../../components/shared/Toast'

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(4, 'Password minimal 4 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useUserStore()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'kasir@kasirai.id',
      password: 'password123',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email)
      showToast('Login Berhasil', 'Selamat datang di sistem KasirAI', 'success')
      navigate('/cashier')
    } catch {
      showToast('Gagal Masuk', 'Periksa kembali email dan kata sandi Anda', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fillQuickDemo = (role: 'cashier' | 'admin') => {
    if (role === 'cashier') {
      setValue('email', 'kasir@kasirai.id')
      setValue('password', 'kasir123')
    } else {
      setValue('email', 'admin@kasirai.id')
      setValue('password', 'admin123')
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Email Kasir / Akun
          </label>
          <Input
            type="email"
            placeholder="nama@toko.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Kata Sandi (PIN)
            </label>
            <span className="text-[11px] text-zinc-400 hover:text-zinc-600 cursor-pointer">
              Lupa sandi?
            </span>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-sm font-semibold mt-2"
          isLoading={isLoading}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Masuk ke Kasir
        </Button>
      </form>

      {/* Quick Demo Accounts */}
      <div className="pt-4 border-t border-zinc-100">
        <p className="text-[11px] font-medium text-zinc-400 text-center mb-2.5">
          Atau coba akun simulasi cepat:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillQuickDemo('cashier')}
            className="text-xs text-zinc-700 hover:bg-zinc-50"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1 text-zinc-500" />
            Akun Kasir
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillQuickDemo('admin')}
            className="text-xs text-zinc-700 hover:bg-zinc-50"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1 text-zinc-500" />
            Akun Admin
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-500">
        Belum memiliki akun toko?{' '}
        <Link to="/register" className="font-semibold text-zinc-900 hover:underline">
          Daftar Toko Baru
        </Link>
      </div>
    </div>
  )
}
