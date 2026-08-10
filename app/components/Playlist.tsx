'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ListMusic, X } from 'lucide-react'
import { usePlayer } from '@/context/PlayerContext'

const Playlist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { tracks, trackIndex, setTrackIndex, setIsPlaying } = usePlayer()

  const panelRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectTrack = (index: number) => {
    setTrackIndex(index)
    setIsPlaying(true)
    setIsOpen(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
       className="fixed top-6 right-6 md:top-auto md:bottom-8.5 md:right-6 z-50 p-3.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-white/90 hover:text-white hover:bg-white/15 transition cursor-pointer"
        aria-label={isOpen ? 'Close playlist' : 'Open playlist'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <ListMusic className="w-5 h-5" />}
      </button>

      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85%] z-40 transition-transform duration-300 ease-out
          border-l border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full pt-16 pb-28 px-4 overflow-y-auto">
          <p className="text-xs uppercase tracking-wide text-white/50 mb-3 px-2">Playlist</p>

          <div className="flex flex-col gap-1">
            {tracks.map((t, index) => {
              const isActive = index === trackIndex
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(index)}
                  className={`flex items-center gap-3 p-2 rounded-2xl text-left transition
                    ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}
                >
                  {t.poster && (
  <img
    src={t.poster}
    alt={t.title}
    className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-white/30"
  />
)}
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-white/90'}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-white/50 truncate">{t.artist}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Playlist