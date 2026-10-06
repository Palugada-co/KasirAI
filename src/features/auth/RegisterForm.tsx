import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, User, Store, ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/useUserStore'
import { useToast } from '../../components/shared/Toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  storeName: z.string().min(3, 'Nama toko minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useUserStore()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: 'Owner KasirAI',
      storeName: 'KasirAI Coffee & Eatery',
      email: 'owner@kasirai.id',
      password: 'password123',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser(data.name, data.email, data.storeName)
      showToast('Pendaftaran Berhasil', `Selamat datang di ${data.storeName}`, 'success')
      navigate('/cashier')
    } catch {
      showToast('Gagal Mendaftar', 'Silakan coba beberapa saat lagi', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Nama Pemilik / Kasir
          </label>
          <Input
            placeholder="Misal: Rian Pratama"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Nama Usaha / Toko
          </label>
          <Input
            placeholder="Misal: Kopi Kenangan KasirAI"
            leftIcon={<Store className="w-4 h-4" />}
            error={errors.storeName?.message}
            {...register('storeName')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Email Bisnis
          </label>
          <Input
            type="email"
            placeholder="owner@toko.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Kata Sandi
          </label>
          <Input
            type="password"
            placeholder="Minimal 6 karakter"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-sm font-semibold mt-4"
          isLoading={isLoading}
        >
          <span>Daftar & Masuk Kasir</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        Sudah memiliki akun kasir?{' '}
        <Link to="/login" className="font-semibold text-zinc-900 hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  )
}
