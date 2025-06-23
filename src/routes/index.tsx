import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { VideoPlayer } from '../components/VideoPlayer'
import { SegmentLoadingIndicator } from '../components/SegmentLoadingIndicator'
import { ElapsedTimeIndicator } from '../components/ElapsedTimeIndicator'

export const Route = createFileRoute('/')({
  component: App,
})

const defaultUrl =
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8'

// URL encoding/decoding functions
const encodeUrl = (url: string): string => {
  // First base64 encode, then reverse the string to make it non-human readable
  const base64 = btoa(url)
  return base64.split('').reverse().join('')
}

const decodeUrl = (encoded: string): string => {
  try {
    // Reverse the string back, then base64 decode
    const reversed = encoded.split('').reverse().join('')
    return atob(reversed)
  } catch {
    return defaultUrl
  }
}

function App() {
  const [videoSrc, setVideoSrc] = useState(defaultUrl)
  const [mountPlayer, setMountPlayer] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [attemptStartTime, setAttemptStartTime] = useState<Date | null>(null)
  const [playingAtTime, setPlayingAtTime] = useState<Date | null>(null)

  // Detect Safari and mobile devices
  const [isUnsupportedBrowser, setIsUnsupportedBrowser] = useState(false)
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
    const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/.test(
      userAgent,
    )
    setIsUnsupportedBrowser(isSafari || isMobile)
  }, [])

  // Load URL from hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1) // Remove the # symbol
    if (hash) {
      const decodedUrl = decodeUrl(hash)
      setVideoSrc(decodedUrl)
    }
  }, [])

  // Update URL hash when videoSrc changes
  useEffect(() => {
    if (videoSrc && videoSrc !== defaultUrl) {
      const encoded = encodeUrl(videoSrc)
      window.location.hash = encoded
    } else if (videoSrc === defaultUrl && window.location.hash) {
      // Clear hash if using default URL
      window.location.hash = ''
    }
  }, [videoSrc])

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
    <div className="p-8 relative">
      {/* Unsupported Browser Overlay */}
      {isUnsupportedBrowser && (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Device Not Supported
            </h2>
            <p className="text-gray-600 mb-6">
              This demo is not supported on Safari desktop or mobile devices.
              Please use Chrome, Firefox, or Edge on desktop.
            </p>
            <div className="text-sm text-gray-500">
              Safari and mobile browsers have different HLS handling that may
              not work with this demo.
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8">
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

          <div className="flex gap-4 items-center justify-center flex-wrap">
            <button
              onClick={handleClickPreload}
              disabled={!videoSrc.trim() || mountPlayer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {'Preload'}
            </button>
            <button
              onClick={handleClickStartVideo}
              disabled={!videoSrc.trim() || showPlayer}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {'Start Video'}
            </button>
            <button
              onClick={handleClickReset}
              className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors whitespace-nowrap"
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
