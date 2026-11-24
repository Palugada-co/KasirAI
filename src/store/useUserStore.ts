import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthSession } from '../types'

interface UserState extends AuthSession {
  login: (email: string, role?: 'cashier' | 'admin') => Promise<boolean>
  register: (name: string, email: string, storeName: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const DEFAULT_USER: User = {
  id: 'usr-01',
  name: 'Rian Pratama',
  email: 'kasir@palupay.id',
  role: 'cashier',
  storeName: 'PaluPay Coffee & Eatery',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: 'palupay-mock-jwt-token-xyz123',
      user: DEFAULT_USER,
      isAuthenticated: true,

      login: async (email: string, role = 'cashier') => {
        // Mock authentication delay
        await new Promise((resolve) => setTimeout(resolve, 600))
        const user: User = {
          id: 'usr-' + Date.now(),
          name: email.split('@')[0].toUpperCase(),
          email,
          role,
          storeName: 'PaluPay Coffee & Eatery',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        }
        set({
          token: 'palupay-jwt-' + Math.random().toString(36).substring(7),
          user,
          isAuthenticated: true,
        })
        return true
      },

      register: async (name: string, email: string, storeName: string) => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        const user: User = {
          id: 'usr-' + Date.now(),
          name,
          email,
          role: 'admin',
          storeName,
        }
        set({
          token: 'palupay-jwt-' + Math.random().toString(36).substring(7),
          user,
          isAuthenticated: true,
        })
        return true
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },
    }),
    {
      name: 'palupay-auth-storage',
    }
  )
)
