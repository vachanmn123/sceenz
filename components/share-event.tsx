"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Link, Mail, Twitter } from "lucide-react"
import { useState } from "react"

interface ShareEventProps {
  eventUrl: string
  eventTitle: string
}

export function ShareEvent({ eventUrl, eventTitle }: ShareEventProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join me at ${eventTitle}`)
    const body = encodeURIComponent(`I'd like to invite you to ${eventTitle}. Find more details here: ${eventUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Join me at ${eventTitle}! ${eventUrl}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`)
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input value={eventUrl} readOnly />
        <Button variant="outline" onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={shareViaEmail}>
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={shareViaTwitter}>
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={shareViaFacebook}>
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={copyToClipboard}>
          <Link className="h-4 w-4" />
          Copy Link
        </Button>
      </div>
    </div>
  )
}
