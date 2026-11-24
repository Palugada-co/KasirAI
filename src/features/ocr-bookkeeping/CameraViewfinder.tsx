import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'

interface CameraViewfinderProps {
  onCapture: (imageDataUrl: string) => void
  onClose?: () => void
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isFlashing, setIsFlashing] = useState<boolean>(false)

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const startCamera = async () => {
    setCameraError(null)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung pada browser ini.')
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch {
      setCameraError('Tidak dapat mengakses kamera perangkat. Anda dapat menggunakan simulator kamera atau mengunggah file foto.')
    }
  }

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const handleCaptureRealCamera = () => {
    if (!videoRef.current) return
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 200)

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      stopCamera()
      onCapture(dataUrl)
    }
  }

  const handleCaptureSimulation = () => {
    setIsFlashing(true)
    setTimeout(() => {
      setIsFlashing(false)
      stopCamera()
      // Generate a snapshot of the sample ledger
      onCapture('simulated-capture')
    }, 250)
  }

  return (
    <div className="relative bg-zinc-950 text-white rounded-2xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-16/10 flex flex-col justify-between">
      {/* Flash Effect */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 animate-ping opacity-90 transition-opacity" />
      )}

      {/* Top Controls */}
      <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-200">
            {stream ? 'Kamera Langsung Aktif' : 'Simulator Kamera OCR'}
          </span>
        </div>

        {onClose && (
          <button
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Viewfinder Center */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            {/* Viewfinder Grid Overlay */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-emerald-400/60 rounded-xl relative flex flex-col items-center justify-center p-4 bg-emerald-500/5">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br" />

              <Camera className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-zinc-100">Posisikan Catatan Pembukuan</p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">
                Pastikan tulisan tangan terlihat jelas dan cukup cahaya
              </p>
            </div>
            {cameraError && (
              <p className="text-[11px] text-amber-300 mt-3 max-w-sm">
                *Menggunakan mode simulator kamera. Klik tombol jepret di bawah untuk mengambil foto catatan.
              </p>
            )}
          </div>
        )}

        {/* Viewfinder Alignment Marks */}
        {stream && (
          <div className="pointer-events-none absolute inset-6 sm:inset-12 border-2 border-emerald-400/60 rounded-xl flex items-center justify-center">
            <div className="w-full h-0.5 bg-emerald-400/40 animate-pulse" />
          </div>
        )}
      </div>

      {/* Bottom Shutter Action Bar */}
      <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-around">
        <div className="text-xs text-zinc-400 hidden sm:block">
          Mode: Tulisan Tangan
        </div>

        {/* Big Shutter Button */}
        <button
          type="button"
          onClick={stream ? handleCaptureRealCamera : handleCaptureSimulation}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/40 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Ambil Foto"
          aria-label="Ambil Foto Catatan"
        >
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-zinc-950">
            <Camera className="w-5 h-5 text-zinc-950" />
          </div>
        </button>

        <div className="text-right">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={stream ? handleCaptureRealCamera : handleCaptureSimulation}
            className="text-xs text-zinc-300 hover:text-white"
          >
            <span>Jepret Foto</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
