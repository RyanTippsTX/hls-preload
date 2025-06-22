import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ReactPlayer from 'react-player'
import clsx from 'clsx'

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

  const handlePreload = () => {
    setMountPlayer(true)
  }

  const handleStartVideo = () => {
    setMountPlayer(true)
    setShowPlayer(true)
    setPlaying(true)
  }

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">
          HLS Video Preload Demo
        </h1>

        {/* URL input */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex gap-4 items-center">
            <input
              type="url"
              value={videoSrc}
              onChange={(e) => setVideoSrc(e.target.value)}
              placeholder="Enter HLS manifest URL (e.g., https://example.com/playlist.m3u8)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Example URLs */}
          <div className="text-sm text-gray-600">
            <p>Try these sample HLS streams:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Big Buck Bunny:{' '}
                <code className="bg-gray-100 px-1 rounded">
                  https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
                </code>
              </li>
              <li>
                Apple Test Stream:{' '}
                <code className="bg-gray-100 px-1 rounded">
                  https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8
                </code>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 mb-4 items-center justify-center">
            <button
              onClick={handlePreload}
              disabled={!videoSrc.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Preload'}
            </button>
            <button
              onClick={handleStartVideo}
              disabled={!videoSrc.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Start Video'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>

        {mountPlayer && (
          <VideoPlayer
            videoSrc={videoSrc}
            showPlayer={showPlayer}
            playing={playing}
          />
        )}
      </div>
    </div>
  )
}

const VideoPlayer = ({
  videoSrc,
  showPlayer,
  playing,
}: {
  videoSrc: string
  showPlayer: boolean
  playing: boolean
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-lg p-6',
        showPlayer ? 'block' : 'hidden',
      )}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Video Player</h2>
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <ReactPlayer
          url={videoSrc}
          controls={true}
          playing={playing}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          // onPlay={handlePlay}
          // config={{
          //   file: {
          //     forceHLS: true,
          //     hlsOptions: {
          //       enableWorker: true,
          //       lowLatencyMode: false,
          //       backBufferLength: preloadEnabled ? 30 : 0,
          //       maxBufferLength: preloadEnabled ? 30 : 0,
          //       maxMaxBufferLength: preloadEnabled ? 600 : 0,
          //       maxBufferSize: preloadEnabled ? 60 * 1000 * 1000 : 0, // 60MB
          //       maxBufferHole: 0.5,
          //       highBufferWatchdogPeriod: 2,
          //       nudgeOffset: 0.2,
          //       nudgeMaxRetry: 5,
          //       maxFragLookUpTolerance: 0.25,
          //       liveSyncDurationCount: 3,
          //       liveMaxLatencyDurationCount: 10,
          //       liveDurationInfinity: true,
          //       liveBackBufferLength: 0,
          //       liveTolerance: 15,
          //       progressive: false,
          //       debug: false,
          //       // Preloading settings
          //       enableSoftwareAES: true,
          //       // Disable preloading when toggle is off
          //       ...(preloadEnabled
          //         ? {}
          //         : {
          //             maxBufferLength: 0,
          //             maxMaxBufferLength: 0,
          //             backBufferLength: 0,
          //             maxBufferSize: 0,
          //           }),
          //     },
          //   },
          // }}
          onError={(e) => console.error('Player error:', e)}
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Current URL:</strong> {videoSrc}
        </p>
      </div>
    </div>
  )
}
