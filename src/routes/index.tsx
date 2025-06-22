import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { VideoPlayer } from '../components/VideoPlayer'
import { SegmentLoadingIndicator } from '../components/SegmentLoadingIndicator'
import { ElapsedTimeIndicator } from '../components/ElapsedTimeIndicator'

export const Route = createFileRoute('/')({
  component: App,
})

const defaultUrl =
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8'

function App() {
  const [videoSrc, setVideoSrc] = useState(defaultUrl)
  const [mountPlayer, setMountPlayer] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [attemptStartTime, setAttemptStartTime] = useState<Date | null>(null)
  const [playingAtTime, setPlayingAtTime] = useState<Date | null>(null)

  // Button Handlers
  const handleClickPreload = () => {
    setMountPlayer(true)
  }
  const handleClickStartVideo = () => {
    setMountPlayer(true)
    setShowPlayer(true)
    setAttemptStartTime(new Date())
  }
  const handleClickReset = () => {
    window.location.reload()
  }

  // Video Handlers
  const onPlaying = () => {
    console.log('🔥 playing...')
    if (attemptStartTime && !playingAtTime) {
      console.log('🔥 setting playingAtTime...')
      setPlayingAtTime(new Date())
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-xl mx-auto space-y-8">
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
              onClick={handleClickPreload}
              disabled={!videoSrc.trim() || mountPlayer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Preload'}
            </button>
            <button
              onClick={handleClickStartVideo}
              disabled={!videoSrc.trim() || showPlayer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Start Video'}
            </button>
            <button
              onClick={handleClickReset}
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
        {showPlayer && attemptStartTime && (
          <ElapsedTimeIndicator
            startTime={attemptStartTime}
            playingAtTime={playingAtTime}
          />
        )}

        {mountPlayer && (
          <VideoPlayer
            videoSrc={videoSrc}
            showPlayer={showPlayer}
            onPlaying={onPlaying}
          />
        )}
      </div>
    </div>
  )
}
