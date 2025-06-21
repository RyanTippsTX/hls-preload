import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface VideoPlayerProps {
  url: string
  title: string
  preloadedHls?: Hls | null
  onPlayStart?: () => void
  onError?: (error: string) => void
}

export function VideoPlayer({ url, title, preloadedHls, onPlayStart, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playbackTime, setPlaybackTime] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setPlaybackTime(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !url) return

    setIsLoading(true)
    setError(null)

    // If we have a preloaded HLS instance, use it
    if (preloadedHls) {
      console.log('Using preloaded HLS instance')
      hlsRef.current = preloadedHls
      
      // Attach the preloaded HLS to the video element
      hlsRef.current.attachMedia(video)
      
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Preloaded HLS manifest parsed')
        setIsLoading(false)
      })

      hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          const errorMsg = `HLS Error: ${data.details}`
          setError(errorMsg)
          onError?.(errorMsg)
          setIsLoading(false)
        }
      })
    } else {
      // Create a new HLS instance for regular playback
      if (!Hls.isSupported()) {
        const errorMsg = 'HLS is not supported in this browser'
        setError(errorMsg)
        onError?.(errorMsg)
        setIsLoading(false)
        return
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.2,
        nudgeMaxRetry: 5,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        liveDurationInfinity: true,
        progressive: false,
        debug: false,
      })

      hlsRef.current = hls
      hls.attachMedia(video)
      hls.loadSource(url)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Regular HLS manifest parsed')
        setIsLoading(false)
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          const errorMsg = `HLS Error: ${data.details}`
          setError(errorMsg)
          onError?.(errorMsg)
          setIsLoading(false)
        }
      })
    }

    // Cleanup function
    return () => {
      if (hlsRef.current && !preloadedHls) {
        // Only destroy if it's not the preloaded instance
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [url, preloadedHls, onError])

  const handlePlay = () => {
    const video = videoRef.current
    if (video) {
      video.play().catch((err) => {
        setError(`Playback error: ${err.message}`)
        onError?.(`Playback error: ${err.message}`)
      })
      onPlayStart?.()
    }
  }

  const handlePause = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full rounded"
          controls
          onPlay={handlePlay}
          onPause={handlePause}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
            <div className="text-white">Loading...</div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75 rounded">
            <div className="text-white text-center p-4">
              <div className="font-semibold">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-sm text-gray-300">
        <div>Current Time: {playbackTime.toFixed(2)}s</div>
        {preloadedHls && (
          <div className="text-green-400">✓ Using preloaded HLS</div>
        )}
      </div>
    </div>
  )
} 