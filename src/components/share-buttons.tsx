'use client'

import * as React from 'react'
import { Facebook, MessageCircle, Twitter, Instagram, Link2, Check, Share2 } from 'lucide-react'
import { SITE_LINKS } from '@/lib/links'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/**
 * Social share buttons — Facebook, WhatsApp, X (Twitter), Instagram, copy link.
 * Instagram doesn't support direct URL sharing via web, so we offer copy-link.
 */
export function ShareBar({
  className = '',
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const [copied, setCopied] = React.useState(false)
  const url = SITE_LINKS.site
  const shareText = 'Learn the Riffian language — free Amazigh lessons'

  const share = (platform: string) => {
    const u = encodeURIComponent(url)
    const t = encodeURIComponent(shareText)
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank', 'noopener')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${t}%20${u}`, '_blank', 'noopener')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${t}&url=${u}`, '_blank', 'noopener')
        break
      case 'instagram':
        // Instagram doesn't support web URL share — copy link + open Instagram
        copyLink()
        window.open('https://www.instagram.com/', '_blank', 'noopener')
        toast.success('Link copied — paste it into your Instagram story or bio')
        break
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const btnClass = cn(
    'grid place-items-center rounded-full border border-border bg-card text-foreground/70 transition-all hover:border-primary/40 hover:text-primary hover:scale-105',
    compact ? 'h-9 w-9' : 'h-10 w-10',
  )

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {!compact && (
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Share2 className="h-3.5 w-3.5" /> Share
        </span>
      )}
      <button onClick={() => share('facebook')} className={btnClass} title="Share on Facebook" aria-label="Share on Facebook">
        <Facebook className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
      </button>
      <button onClick={() => share('whatsapp')} className={cn(btnClass, 'hover:border-emerald-500/40 hover:text-emerald-600')} title="Share on WhatsApp" aria-label="Share on WhatsApp">
        <MessageCircle className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
      </button>
      <button onClick={() => share('twitter')} className={btnClass} title="Share on X" aria-label="Share on X">
        <Twitter className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>
      <button onClick={() => share('instagram')} className={cn(btnClass, 'hover:border-pink-500/40 hover:text-pink-600')} title="Share on Instagram" aria-label="Share on Instagram">
        <Instagram className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
      </button>
      <button onClick={copyLink} className={btnClass} title="Copy link" aria-label="Copy link">
        {copied ? <Check className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5 text-emerald-600'} /> : <Link2 className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />}
      </button>
    </div>
  )
}
