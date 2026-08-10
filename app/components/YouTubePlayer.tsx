'use client'

import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { usePlayer } from '@/context/PlayerContext'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const formatTime = (secs: number): string => {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const YouTubePlayer: React.FC = () => {
  const { tracks, loading, error, trackIndex, setTrackIndex, isPlaying, setIsPlaying } =
    usePlayer()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const isReadyRef = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handleForward = () => {
    setTrackIndex((trackIndex + 1) % tracks.length)
    setIsPlaying(true)
  }

  const handleBackward = () => {
    setTrackIndex((trackIndex - 1 + tracks.length) % tracks.length)
    setIsPlaying(true)
  }

  // Load the IFrame API and create the (hidden) player once tracks are ready
  useEffect(() => {
    if (tracks.length === 0) return

    const createPlayer = () => {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: tracks[trackIndex]?.id,
        playerVars: { autoplay: 0, rel: 0, controls: 0 },
        events: {
          onReady: () => {
            isReadyRef.current = true
            setDuration(playerRef.current.getDuration())
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
              setDuration(playerRef.current.getDuration())
            }
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false)
            if (e.data === window.YT.PlayerState.ENDED) handleForward()
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
      window.onYouTubeIframeAPIReady = createPlayer
    }

    return () => {
      playerRef.current?.destroy?.()
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [tracks.length])

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code !== 'Space') return

    const target = e.target as HTMLElement
    const isEditable =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable

    if (isEditable) return // let spacebar behave normally in form fields

    e.preventDefault() // stop page from scrolling down, and stop double-trigger on a focused button
    togglePlay()
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isPlaying])

  // Poll currentTime while playing (YouTube API has no timeupdate event)
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current)

    if (isPlaying) {
      pollRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime())
        }
      }, 500)
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [isPlaying])

  // Load new video when trackIndex changes
  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current || tracks.length === 0) return
    const videoId = tracks[trackIndex]?.id
    if (!videoId) return

    setCurrentTime(0)

    if (isPlaying) {
      playerRef.current.loadVideoById(videoId)
    } else {
      playerRef.current.cueVideoById(videoId)
    }
  }, [trackIndex, tracks])

  const togglePlay = () => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setCurrentTime(value)
    playerRef.current?.seekTo(value, true)
  }

  if (loading) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl text-white/80 text-sm">
        Loading playlist…
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border border-red-400/30 bg-red-500/10 backdrop-blur-2xl text-red-200 text-sm">
        {error}
      </div>
    )
  }

  const track = tracks[trackIndex]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
      {/* Hidden YouTube iframe — audio only, no visible video UI */}
      <div ref={containerRef} className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none" />

      <div className="flex items-center gap-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] px-4 py-3">
        {/* Cover with CD spin + center dot */}
        <div className="relative w-11 h-11 shrink-0">
          <img
            src={track?.poster}
            alt={track?.title}
            className="w-11 h-11 rounded-full object-cover ring-1 ring-white/30 animate-[spin_4s_linear_infinite]"
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black pointer-events-none" />
        </div>

        {/* Song info + timeline */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-white truncate">
              {track?.title}
              <span className="text-white/60 font-normal"> · {track?.artist}</span>
            </p>
            <span className="text-[11px] text-white/60 tabular-nums shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{
              background: `linear-gradient(to right, rgba(255,255,255,0.9) ${
                duration ? (currentTime / duration) * 100 : 0
              }%, rgba(255,255,255,0.2) ${duration ? (currentTime / duration) * 100 : 0}%)`,
            }}
            className="w-full h-1 mt-1.5 rounded-full cursor-pointer appearance-none
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[2px] [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:shadow-none
                       [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[2px] [&::-moz-range-thumb]:h-3
                       [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-none
                       [&::-moz-range-progress]:bg-transparent"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBackward}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={handleForward}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default YouTubePlayer