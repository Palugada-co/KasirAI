import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = 'Tanyakan analisa omzet, sisa stok, rekomendasi diskon...',
}) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!text.trim() || isLoading) return
    onSendMessage(text.trim())
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [text])

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white rounded-2xl border border-zinc-200 p-2 shadow-xs focus-within:ring-2 focus-within:ring-zinc-950 focus-within:border-zinc-950 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 max-h-32 p-2 text-xs text-zinc-900 placeholder:text-zinc-400 bg-transparent resize-none focus:outline-none leading-relaxed disabled:opacity-50"
      />

      <Button
        type="submit"
        size="icon"
        variant="primary"
        disabled={!text.trim() || isLoading}
        className="h-9 w-9 shrink-0 rounded-xl"
        aria-label="Kirim pesan"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <Send className="w-4 h-4 text-white" />
        )}
      </Button>
    </form>
  )
}
