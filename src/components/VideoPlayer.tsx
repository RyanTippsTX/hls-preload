import { useState, useRef } from 'react'
import ReactPlayer from 'react-player'

interface VideoPlayerProps {
  url: string
  title: string
  isPreloaded?: boolean
  playing?: boolean
  onPlayStart?: () => void
  onError?: (error: string) => void
}

export function VideoPlayer({ url, title, isPreloaded = false, playing = false, onPlayStart, onError }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef<ReactPlayer>(null)

  const handleReady = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleError = (error: any) => {
    const errorMsg = `Playback error: ${error?.message || 'Unknown error'}`
    setError(errorMsg)
    onError?.(errorMsg)
    setIsLoading(false)
  }

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setPlaybackTime(state.playedSeconds)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handlePlay = () => {
    onPlayStart?.()
  }

  const handleBuffer = () => {
    setIsLoading(true)
  }

  const handleBufferEnd = () => {
    setIsLoading(false)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      
      <div className="relative">
        <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            controls={true}
            playing={playing}
            muted={true}
            onReady={handleReady}
            onError={handleError}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onPlay={handlePlay}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous"
                },
                hlsOptions: {
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
                }
              }
            }}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white">Loading...</div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75">
              <div className="text-white text-center p-4">
                <div className="font-semibold">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-300">
        <div>Current Time: {playbackTime.toFixed(2)}s</div>
        {duration > 0 && <div>Duration: {duration.toFixed(2)}s</div>}
        {isPreloaded && (
          <div className="text-green-400">✓ Using preloaded URL</div>
        )}
      </div>
    </div>
  )
} 