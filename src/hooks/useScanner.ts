import { useEffect, useRef } from 'react'

interface UseScannerProps {
  onScan: (barcode: string) => void
  minChars?: number
  maxIntervalMs?: number
  enabled?: boolean
}

export function useScanner({
  onScan,
  minChars = 4,
  maxIntervalMs = 50,
  enabled = true,
}: UseScannerProps) {
  const bufferRef = useRef<string>('')
  const lastKeyTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input or textarea
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      const now = Date.now()
      const timeDiff = now - lastKeyTimeRef.current
      lastKeyTimeRef.current = now

      // Barcode scanners type very rapidly (< 50ms per key)
      if (timeDiff > maxIntervalMs && bufferRef.current.length > 0) {
        bufferRef.current = ''
      }

      if (e.key === 'Enter') {
        if (bufferRef.current.length >= minChars) {
          onScan(bufferRef.current)
          bufferRef.current = ''
          e.preventDefault()
        }
      } else if (e.key.length === 1) {
        bufferRef.current += e.key
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onScan, minChars, maxIntervalMs, enabled])
}
