import React, { useRef, useEffect, useState } from 'react'
import { MessageBubble } from './MessageBubble'
import { QuickPromptChip } from './QuickPromptChip'
import { ChatInput } from './ChatInput'
import { useAIStore, QUICK_PROMPTS } from '../../store/useAIStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import {
  Bot,
  Sparkles,
  RotateCcw,
  Settings2,
  CheckCircle2,
  Globe,
  Radio,
  Loader2,
} from 'lucide-react'

export const ChatWindow: React.FC = () => {
  const {
    messages,
    isLoading,
    webhookUrl,
    sendMessage,
    clearHistory,
    setWebhookUrl,
  } = useAIStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWebhookSettings, setShowWebhookSettings] = useState(false)
  const [inputWebhook, setInputWebhook] = useState(webhookUrl)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault()
    setWebhookUrl(inputWebhook.trim())
    setShowWebhookSettings(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full p-3 sm:p-6">
      {/* Chat Window Container */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-900 leading-tight">
                  KasirAI Copilot
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>OpenClaw Engine Active</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {webhookUrl
                  ? `Webhook kustom: ${webhookUrl}`
                  : 'Mode Otomatis: Terhubung langsung ke database POS & Inventori lokal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowWebhookSettings(!showWebhookSettings)}
              title="Konfigurasi Webhook n8n"
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset riwayat percakapan dengan AI?')) {
                  clearHistory()
                }
              }}
              title="Bersihkan Percakapan"
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Webhook Configuration Drawer */}
        {showWebhookSettings && (
          <form
            onSubmit={handleSaveWebhook}
            className="p-4 bg-zinc-50 border-b border-zinc-200 space-y-2.5 animate-scale-up text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                <Globe className="w-4 h-4 text-zinc-600" />
                <span>Pengaturan Webhook n8n / OpenClaw Server</span>
              </div>
              <span className="text-[10px] text-zinc-400">
                Env: VITE_N8N_CHATBOT_WEBHOOK_URL
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Masukkan URL webhook n8n jika Anda ingin mengarahkan pertanyaan ke workflow backend kustom:
            </p>
            <div className="flex gap-2">
              <Input
                type="url"
                value={inputWebhook}
                onChange={(e) => setInputWebhook(e.target.value)}
                placeholder="https://n8n.yourdomain.com/webhook/kasirai-chat"
                className="h-9 text-xs"
              />
              <Button type="submit" variant="primary" size="sm" className="h-9 px-4 shrink-0">
                Simpan
              </Button>
            </div>
          </form>
        )}

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-50/50">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center text-amber-300 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-zinc-200 px-4 py-2.5 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-700" />
                <span>KasirAI sedang menganalisa data POS toko...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Chat Input */}
        <div className="p-3 sm:p-4 bg-white border-t border-zinc-200 space-y-2.5">
          <QuickPromptChip
            prompts={QUICK_PROMPTS}
            onSelectPrompt={(text) => sendMessage(text)}
            disabled={isLoading}
          />

          <ChatInput onSendMessage={(text) => sendMessage(text)} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
