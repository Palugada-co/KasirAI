import React, { useEffect, useState } from 'react'
import { Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'

interface OCRProcessingAnimationProps {
  imageSrc: string
  onComplete: () => void
}

const STEPS = [
  { id: 1, text: 'Memuat & memproses resolusi foto catatan...', delay: 350 },
  { id: 2, text: 'Mendeteksi garis pembatas & segmen tulisan tangan...', delay: 750 },
  { id: 3, text: 'Ekstraksi nama item, kuantitas, & harga satuan...', delay: 1150 },
  { id: 4, text: 'Mencocokkan katalog menu & kalkulasi total transaksi...', delay: 1550 },
]

export const OCRProcessingAnimation: React.FC<OCRProcessingAnimationProps> = ({
  imageSrc,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(15)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1)
      setProgress(45)
    }, 450)

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2)
      setProgress(75)
    }, 950)

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3)
      setProgress(95)
    }, 1450)

    const timer4 = setTimeout(() => {
      setProgress(100)
      onComplete()
    }, 1850)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-amber-300 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-950 leading-tight">
              Memproses OCR Catatan Pembukuan...
            </h3>
            <p className="text-xs text-zinc-500">
              Mesin OCR sedang membaca tulisan tangan dan mengekstrak rincian transaksi
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onComplete}
          className="text-xs font-semibold"
        >
          <span>Lewati</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Image with laser sweep animation */}
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900 aspect-4/3 flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Scanning document"
            className="w-full h-full object-contain filter contrast-105"
          />

          {/* Scanning Laser Beam */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse"
            style={{
              top: `${Math.min(95, Math.max(5, (progress * 1.8) % 95))}%`,
              transition: 'top 0.4s ease-out',
            }}
          />

          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />

          {/* Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-emerald-400 font-mono text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>OCR Scanner Engine Active</span>
          </div>
        </div>

        {/* Right: Step by step checklist & Progress */}
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-700">
              <span>Progres Pemindaian</span>
              <span className="font-mono text-zinc-950">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
              <div
                className="h-full bg-zinc-950 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step items */}
          <div className="space-y-3 pt-2">
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex
              const isCurrent = idx === currentStepIndex
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 text-xs p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-zinc-50 border-zinc-300 shadow-2xs font-semibold text-zinc-900'
                      : isDone
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
                      : 'border-transparent text-zinc-400 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-800" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-300 text-[10px] flex items-center justify-center font-mono">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 leading-snug">{step.text}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
