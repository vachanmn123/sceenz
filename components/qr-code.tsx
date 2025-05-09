"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeProps {
  value: string
  size?: number
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // In a real app, you would use a QR code library like qrcode.js
    // This is just a placeholder to show the UI
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, size, size)

        // Draw a fake QR code pattern
        ctx.fillStyle = "black"
        const cellSize = Math.floor(size / 25)

        // Draw position detection patterns (corners)
        // Top-left
        ctx.fillRect(0, 0, 7 * cellSize, 7 * cellSize)
        ctx.fillStyle = "white"
        ctx.fillRect(cellSize, cellSize, 5 * cellSize, 5 * cellSize)
        ctx.fillStyle = "black"
        ctx.fillRect(2 * cellSize, 2 * cellSize, 3 * cellSize, 3 * cellSize)

        // Top-right
        ctx.fillStyle = "black"
        ctx.fillRect(size - 7 * cellSize, 0, 7 * cellSize, 7 * cellSize)
        ctx.fillStyle = "white"
        ctx.fillRect(size - 6 * cellSize, cellSize, 5 * cellSize, 5 * cellSize)
        ctx.fillStyle = "black"
        ctx.fillRect(size - 5 * cellSize, 2 * cellSize, 3 * cellSize, 3 * cellSize)

        // Bottom-left
        ctx.fillStyle = "black"
        ctx.fillRect(0, size - 7 * cellSize, 7 * cellSize, 7 * cellSize)
        ctx.fillStyle = "white"
        ctx.fillRect(cellSize, size - 6 * cellSize, 5 * cellSize, 5 * cellSize)
        ctx.fillStyle = "black"
        ctx.fillRect(2 * cellSize, size - 5 * cellSize, 3 * cellSize, 3 * cellSize)

        // Draw random dots to simulate QR code data
        ctx.fillStyle = "black"
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            // Skip the corner patterns
            if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) continue

            if (Math.random() > 0.6) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
            }
          }
        }
      }
    }
  }, [value, size])

  const downloadQRCode = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "event-qrcode.png"
      link.href = url
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} width={size} height={size} className="border rounded-md" />
      <Button onClick={downloadQRCode} variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  )
}
