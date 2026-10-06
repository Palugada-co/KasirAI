import { useState, useCallback } from 'react'
import { Transaction } from '../types'
import { formatRupiah, formatDate } from '../lib/utils'

export type PaperSize = '58mm' | '80mm'

export function useThermalPrinter() {
  const [paperSize, setPaperSize] = useState<PaperSize>('58mm')
  const [isPrinting, setIsPrinting] = useState<boolean>(false)

  // Beep sound simulation using Web Audio API
  const playPrintFeedback = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch {
      // Audio context might be restricted
    }
  }, [])

  const printReceipt = useCallback(async (): Promise<boolean> => {
    setIsPrinting(true)
    playPrintFeedback()

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          window.print()
          resolve(true)
        } catch (e) {
          console.error('Print failed:', e)
          resolve(false)
        } finally {
          setIsPrinting(false)
        }
      }, 300)
    })
  }, [playPrintFeedback])

  const generateEscPosText = useCallback(
    (trx: Transaction, storeName = 'KasirAI Coffee & Eatery'): string => {
      const width = paperSize === '58mm' ? 32 : 48
      const separator = '-'.repeat(width)

      const center = (text: string) => {
        const pad = Math.max(0, Math.floor((width - text.length) / 2))
        return ' '.repeat(pad) + text
      }

      const row = (left: string, right: string) => {
        const space = Math.max(1, width - left.length - right.length)
        return left + ' '.repeat(space) + right
      }

      let lines: string[] = []
      lines.push(center(storeName.toUpperCase()))
      lines.push(center('Smart Point of Sale'))
      lines.push(separator)
      lines.push(row('Order ID:', trx.orderNumber))
      lines.push(row('Kasir:', trx.cashierName))
      lines.push(row('Waktu:', formatDate(trx.date)))
      lines.push(row('Tipe:', trx.orderType.toUpperCase()))
      if (trx.tableNumber) lines.push(row('Meja:', trx.tableNumber))
      lines.push(separator)

      trx.items.forEach((item) => {
        lines.push(item.product.name)
        lines.push(
          row(
            `  ${item.quantity} x ${formatRupiah(item.product.price)}`,
            formatRupiah(item.quantity * item.product.price)
          )
        )
      })

      lines.push(separator)
      lines.push(row('Subtotal:', formatRupiah(trx.subtotal)))
      if (trx.discountAmount > 0) {
        lines.push(row(`Diskon (${trx.discountRate}%):`, `-${formatRupiah(trx.discountAmount)}`))
      }
      lines.push(row(`PPN (${trx.taxRate}%):`, formatRupiah(trx.taxAmount)))
      lines.push(row('TOTAL:', formatRupiah(trx.total)))
      lines.push(separator)
      lines.push(row(`Bayar (${trx.paymentMethod.toUpperCase()}):`, formatRupiah(trx.amountPaid)))
      lines.push(row('Kembalian:', formatRupiah(trx.changeAmount)))
      lines.push(separator)
      lines.push(center('Terima kasih atas kunjungan Anda!'))
      lines.push(center('Powered by KasirAI'))
      lines.push('\n\n')

      return lines.join('\n')
    },
    [paperSize]
  )

  return {
    paperSize,
    setPaperSize,
    isPrinting,
    printReceipt,
    generateEscPosText,
  }
}
