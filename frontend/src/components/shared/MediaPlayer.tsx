import { useRef, useState, useCallback } from 'react'
import { Play, Pause, RotateCcw, Rewind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VideoConfig } from '@/types'

function toYouTubeEmbed(src: string): string | null {
  let videoId: string | null = null
  try {
    const url = new URL(src)
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      videoId = url.searchParams.get('v')
    } else if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
      videoId = url.pathname.split('/embed/')[1]?.split('?')[0] ?? null
    } else if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/shorts/')[1]?.split('?')[0] ?? null
    } else if (url.hostname === 'youtu.be') {
      videoId = url.pathname.slice(1).split('?')[0]
    }
  } catch {
    return null
  }
  if (!videoId) return null
  const extra = new URL(src).searchParams
  extra.delete('v')
  const extraStr = extra.toString()
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1${extraStr ? '&' + extraStr : ''}`
}

function getGDriveFileId(src: string): string | null {
  try {
    const url = new URL(src)
    if (!url.hostname.includes('drive.google.com')) return null
    const match = url.pathname.match(/\/file\/d\/([^/]+)/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

interface MediaPlayerProps {
  video: VideoConfig
  onVideoEnd?: () => void
  className?: string
}

export function MediaPlayer({ video, onVideoEnd, className }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const togglePlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setIsPlaying(true)
    } else {
      el.pause()
      setIsPlaying(false)
    }
  }, [])

  const rewind = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = Math.max(0, el.currentTime - 10)
  }, [])

  const replay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = 0
    el.play()
    setIsPlaying(true)
    setHasEnded(false)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setHasEnded(true)
    onVideoEnd?.()
  }, [onVideoEnd])

  const youtubeEmbedUrl = toYouTubeEmbed(video.src)
  const gdriveFileId = getGDriveFileId(video.src)

  // Google Drive videos — use embedded player
  if (gdriveFileId) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-card">
          <iframe
            src={`https://drive.google.com/file/d/${gdriveFileId}/preview`}
            className="w-full aspect-video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
            title="Video clue"
          />
        </div>
      </div>
    )
  }

  if (youtubeEmbedUrl) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-card">
          <iframe
            src={youtubeEmbedUrl}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video clue"
          />
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={cn('rounded-2xl bg-yellow-tint p-6 text-center', className)}>
        <p className="text-lg text-text-secondary">{video.fallbackText}</p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="relative overflow-hidden rounded-2xl bg-black shadow-card">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          onEnded={handleEnded}
          onError={() => setHasError(true)}
          playsInline
          className="w-full aspect-video object-cover"
        >
          {video.subtitles && (
            <track kind="subtitles" src={video.subtitles} srcLang="uk" label="Ukrainian" default />
          )}
        </video>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={rewind}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-blue-light hover:border-blue-primary transition-colors shadow-card"
          aria-label="Rewind 10 seconds"
        >
          <Rewind className="w-5 h-5 text-blue-primary" />
        </button>

        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-primary text-white hover:bg-blue-primary/90 transition-colors shadow-card"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        <button
          onClick={replay}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-blue-light hover:border-blue-primary transition-colors shadow-card',
            hasEnded && 'border-yellow-accent animate-pulse-soft',
          )}
          aria-label="Replay"
        >
          <RotateCcw className="w-5 h-5 text-blue-primary" />
        </button>
      </div>
    </div>
  )
}
