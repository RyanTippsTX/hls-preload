import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { VideoPlayer } from '../components/VideoPlayer'
import clsx from 'clsx'
import { SegmentLoadingIndicator } from '../components/SegmentLoadingIndicator'

export const Route = createFileRoute('/')({
  component: App,
})

const defaultUrl =
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8'

function App() {
  const [videoSrc, setVideoSrc] = useState(defaultUrl)
  const [mountPlayer, setMountPlayer] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number | null>(null)
  const [isVideoStarted, setIsVideoStarted] = useState(false)

  const handlePreload = () => {
    setMountPlayer(true)
  }

  const handleStartVideo = () => {
    setMountPlayer(true)
    setShowPlayer(true)
    setPlaying(true)
    setStartTime(new Date())
    setElapsedTime(null)
    setIsVideoStarted(false)
  }

  const handleReset = () => {
    window.location.reload()
  }

  const handleVideoStart = () => {
    if (startTime && !isVideoStarted) {
      const now = new Date()
      const elapsed = now.getTime() - startTime.getTime()
      setElapsedTime(elapsed)
      setIsVideoStarted(true)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">HLS Preload Demo</h1>

        {/* URL input */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <span className="text-xs font-medium text-gray-500 px-3 border-r border-gray-300">
                  URL
                </span>
              </div>
              <input
                type="url"
                value={videoSrc}
                onChange={(e) => setVideoSrc(e.target.value)}
                placeholder="https://example.com/playlist.m3u8"
                className="w-full pl-16 pr-4 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 truncate"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={handlePreload}
              disabled={!videoSrc.trim() || mountPlayer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Preload'}
            </button>
            <button
              onClick={handleStartVideo}
              disabled={!videoSrc.trim() || showPlayer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Start Video'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* <div className="text-sm text-gray-500">
            Check the Network tab for ".ts" files...
          </div> */}
          <SegmentLoadingIndicator />
        </div>

        {/* Elapsed Time Indicator */}
        {startTime && (
          <ElapsedTimeIndicator
            startTime={startTime}
            elapsedTime={elapsedTime}
            isVideoStarted={isVideoStarted}
          />
        )}

        {mountPlayer && (
          <VideoPlayer
            videoSrc={videoSrc}
            showPlayer={showPlayer}
            playing={playing}
            onVideoStart={handleVideoStart}
          />
        )}
      </div>
    </div>
  )
}

const ElapsedTimeIndicator = ({
  startTime,
  elapsedTime,
  isVideoStarted,
}: {
  startTime: Date
  elapsedTime: number | null
  isVideoStarted: boolean
}) => {
  const [currentElapsed, setCurrentElapsed] = useState<number>(0)

  useEffect(() => {
    if (!isVideoStarted) {
      const interval = setInterval(() => {
        const now = new Date()
        const elapsed = now.getTime() - startTime.getTime()
        setCurrentElapsed(elapsed)
      }, 100)

      return () => clearInterval(interval)
    }
  }, [startTime, isVideoStarted])

  const displayTime = elapsedTime !== null ? elapsedTime : currentElapsed

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Video Startup Latency</h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'w-3 h-3 rounded-full',
              isVideoStarted ? 'bg-green-500' : 'bg-yellow-500 animate-pulse',
            )}
          />
          <span className="text-sm font-medium">
            {isVideoStarted ? 'Video Started' : 'Waiting for video...'}
          </span>
        </div>

        <div className="text-2xl font-mono font-bold text-blue-600">
          {(displayTime / 1000).toFixed(2)}s
        </div>
      </div>
    </div>
  )
}
