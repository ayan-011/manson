'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface YouTubeTrack {
  id: string // YouTube videoId
  title: string
  artist: string
  poster: string
}

interface PlayerContextType {
  tracks: YouTubeTrack[]
  loading: boolean
  error: string | null
  trackIndex: number
  setTrackIndex: (index: number) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)
const STORAGE_KEY = 'last-track-index'

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<YouTubeTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trackIndex, setTrackIndexState] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/youtube-playlist')
        const data = await res.json()
        if (data.error) {
          setError(data.error)
        } else {
          setTracks(data.tracks)
        }
      } catch {
        setError('Could not load playlist')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      const index = Number(saved)
      if (!isNaN(index) && index >= 0) setTrackIndexState(index)
    }
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (hasHydrated) localStorage.setItem(STORAGE_KEY, String(trackIndex))
  }, [trackIndex, hasHydrated])

  const setTrackIndex = (index: number) => setTrackIndexState(index)

  return (
    <PlayerContext.Provider
      value={{ tracks, loading, error, trackIndex, setTrackIndex, isPlaying, setIsPlaying }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = (): PlayerContextType => {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider')
  return ctx
}