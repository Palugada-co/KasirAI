import React from 'react'
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#18181B] flex items-center justify-center text-white shadow-md">
              <span className="text-xl font-extrabold tracking-tight">K</span>
              <Sparkles className="w-4 h-4 -ml-0.5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-zinc-950">KasirAI</span>
                <span className="text-xs bg-zinc-200 text-zinc-800 font-bold px-2 py-0.5 rounded-full">
                  POS
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Smart Retail & F&B Management</p>
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900">
          {title}
        </h2>
        <p className="mt-1.5 text-center text-xs text-zinc-500">{subtitle}</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-[#E5E7EB] rounded-2xl">
          {children}
        </div>

        {/* Feature Badges below login */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-500">
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-zinc-700" />
            <span>Fast Checkout</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
            <span>Stok Realtime</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Copilot</span>
          </div>
        </div>
      </div>
    </div>
  )
}
