import React from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { ChatWindow } from '../features/ai-assistant/ChatWindow'

export const AIAssistantPage: React.FC = () => {
  return (
    <PageContainer
      title="KasirAI Copilot (OpenClaw Engine)"
      subtitle="Asisten AI cerdas untuk analisis data toko, stok real-time, dan strategi penjualan"
    >
      <ChatWindow />
    </PageContainer>
  )
}
