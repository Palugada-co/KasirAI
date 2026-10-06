import React from 'react'
import { ChatMessage } from '../../types'
import { Sparkles, User, Bot, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'

interface MessageBubbleProps {
  message: ChatMessage
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user'

  const formattedTime = new Date(message.timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Format content: convert markdown bold (**bold**) and bullet points (* / -) cleanly
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Bold rendering
      const parts = line.split(/(\*\*.*?\*\*)/g)

      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-zinc-950">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={index} className="ml-4 list-disc text-xs leading-relaxed">
            {formattedLine}
          </li>
        )
      }

      if (line.trim() === '') {
        return <div key={index} className="h-2" />
      }

      return (
        <p key={index} className="text-xs leading-relaxed">
          {formattedLine}
        </p>
      )
    })
  }

  return (
    <div
      className={cn(
        'flex gap-3 max-w-[85%] md:max-w-[75%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs text-xs font-bold',
          isUser
            ? 'bg-zinc-900 text-white'
            : 'bg-[#18181B] text-amber-300'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div className="space-y-1">
        <div
          className={cn(
            'p-4 rounded-2xl shadow-2xs border text-xs leading-relaxed',
            isUser
              ? 'bg-[#18181B] text-white border-zinc-900 rounded-tr-xs'
              : 'bg-white text-zinc-800 border-zinc-200 rounded-tl-xs'
          )}
        >
          {!isUser && (
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-zinc-100 text-[11px] font-bold text-zinc-900">
              <Bot className="w-3.5 h-3.5 text-zinc-700" />
              <span>KasirAI Copilot</span>
              <span className="text-[10px] bg-zinc-100 text-zinc-500 font-mono px-1.5 py-0.2 rounded font-normal">
                OpenClaw
              </span>
            </div>
          )}

          <div className={cn('space-y-1', isUser && 'text-zinc-100 font-medium')}>
            {renderFormattedContent(message.content)}
          </div>
        </div>

        <div
          className={cn(
            'flex items-center gap-1 text-[10px] text-zinc-400 px-1',
            isUser ? 'justify-end' : 'justify-start'
          )}
        >
          <Clock className="w-2.5 h-2.5" />
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  )
}
