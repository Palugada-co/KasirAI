import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ShiftModal } from './ShiftModal'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  onOpenSearch?: () => void
  onToggleCart?: () => void
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  onOpenSearch,
  onToggleCart,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col antialiased">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
      />

      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <Header
          title={title}
          subtitle={subtitle}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
          onOpenSearch={onOpenSearch}
          onOpenShiftModal={() => setIsShiftModalOpen(true)}
          onToggleCart={onToggleCart}
        />

        <main className="flex-1 flex flex-col">{children}</main>
      </div>

      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
      />
    </div>
  )
}
