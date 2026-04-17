'use client'

import { useState } from 'react'
import { X, Trophy } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-[#8dc63f] text-[#1a2744]">
      <div className="container-custom flex items-center justify-center py-2 text-sm font-semibold tracking-wide gap-2">
        <Trophy className="h-3.5 w-3.5 flex-shrink-0" />
        <p>Free shipping on US orders over $75 &mdash; Rated #1 by competitive players</p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-60 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
