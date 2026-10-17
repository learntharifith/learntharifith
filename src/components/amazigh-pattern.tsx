'use client'

import * as React from 'react'

/**
 * Amazigh-inspired decorative SVGs.
 * Geometric, symmetric motifs echoing Berber carpets, tattoos & Tifinagh.
 */

// A symmetric woven-carpet band — used as section dividers.
export function AmazighBand({
  className = '',
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 24"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
        {/* central diamond */}
        <path d="M120 2 L138 12 L120 22 L102 12 Z" />
        <path d="M120 7 L132 12 L120 17 L108 12 Z" />
        {/* diamonds left/right */}
        <path d="M84 6 L96 12 L84 18 L72 12 Z" />
        <path d="M156 6 L168 12 L156 18 L144 12 Z" />
        {/* zigzag run */}
        <path d="M2 12 L10 6 L18 12 L26 6 L34 12 L42 6 L50 12 L58 6 L66 12" />
        <path d="M174 12 L182 6 L190 12 L198 6 L206 12 L214 6 L222 12 L230 6 L238 12" />
        {/* dots */}
        <circle cx="60" cy="12" r="1.4" fill={color} />
        <circle cx="180" cy="12" r="1.4" fill={color} />
      </g>
    </svg>
  )
}

// Eight-point Amazigh star (khatam), used as a logo mark.
export function AmazighStar({
  className = '',
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M24 3 L29 14 L41 12 L33 21 L45 24 L33 27 L41 36 L29 34 L24 45 L19 34 L7 36 L15 27 L3 24 L15 21 L7 12 L19 14 Z" />
        <circle cx="24" cy="24" r="4.5" />
      </g>
    </svg>
  )
}

// Large faint background pattern — overlapping diamonds & crosses.
export function AmazighField({
  className = '',
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  const cells = []
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 10; x++) {
      const cx = x * 90 + (y % 2 === 0 ? 0 : 45)
      const cy = y * 80
      cells.push(
        <g key={`${x}-${y}`} stroke={color} strokeWidth="1" fill="none">
          <path d={`M${cx} ${cy - 18} L${cx + 18} ${cy} L${cx} ${cy + 18} L${cx - 18} ${cy} Z`} />
          <path d={`M${cx} ${cy - 8} L${cx + 8} ${cy} L${cx} ${cy + 8} L${cx - 8} ${cy} Z`} />
        </g>,
      )
    }
  }
  return (
    <svg
      className={className}
      viewBox="0 0 900 480"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {cells}
    </svg>
  )
}

// A single Tifinagh-style glyph row used as a marquee strip.
const TIFINAGH = 'ⵣ ⵜ ⴰ ⵔ ⵉ ⴼ ⴰ ⵏ ⵅ ⵙ ⵄ ⵍ ⵎ ⵇ ⵕ ⵀ ⵢ ⵓ ⵊ ⵛ'

export function TifinaghStrip({ className = '' }: { className?: string }) {
  const row = `${TIFINAGH}  •  ${TIFINAGH}  •  `
  return (
    <div
      className={`lt-tifinagh overflow-hidden whitespace-nowrap ${className}`}
      aria-hidden="true"
    >
      <div className="lt-marquee inline-block">
        <span className="mx-4">{row}</span>
        <span className="mx-4">{row}</span>
      </div>
    </div>
  )
}
