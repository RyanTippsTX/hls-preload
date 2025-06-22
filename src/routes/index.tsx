import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ReactPlayer from 'react-player'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [url, setUrl] = useState('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8')
  const [videoUrl, setVideoUrl] = useState('')
  const [preloadEnabled, setPreloadEnabled] = useState(true)
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null)
  const [playbackStartTime, setPlaybackStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number | null>(null)
  

  const handleLoad = () => {
    setVideoUrl(url.trim())
    setLoadStartTime(Date.now())
    setPlaybackStartTime(null)
    setElapsedTime(null)
  }

  const handleReset = () => {
    setVideoUrl('')
    setUrl('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8')
    setLoadStartTime(null)
    setPlaybackStartTime(null)
    setElapsedTime(null)
  }

  const handlePlay = () => {
    if (loadStartTime && !playbackStartTime) {
      const startTime = Date.now()
      setPlaybackStartTime(startTime)
      setElapsedTime(startTime - loadStartTime)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          HLS Video Player Demo
        </h1>
        
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter HLS manifest URL (e.g., https://example.com/playlist.m3u8)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLoad}
              disabled={!url.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {'Load'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preloadEnabled}
                onChange={(e) => setPreloadEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Enable HLS Segment Preloading</span>
            </label>
            <span className="text-xs text-gray-500">
              {preloadEnabled ? 'Segments will be preloaded for smoother playback' : 'Segments will only load when needed'}
            </span>
          </div>

          {loadStartTime && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">Load Timer</div>
              <div className="text-xs text-blue-600">
                {playbackStartTime ? (
                  <span>Playback started in <strong>{elapsedTime}ms</strong></span>
                ) : (
                  <span>Waiting for playback to start...</span>
                )}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Try these sample HLS streams:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Big Buck Bunny: <code className="bg-gray-100 px-1 rounded">https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8</code></li>
              <li>Apple Test Stream: <code className="bg-gray-100 px-1 rounded">https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8</code></li>
            </ul>
          </div>
        </div>

        {videoUrl && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Video Player</h2>
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <ReactPlayer
                url={videoUrl}
                controls={true}
                playing={true}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                onPlay={handlePlay}
                config={{
                  file: {
                    forceHLS: true,
                    hlsOptions: {
                      enableWorker: true,
                      lowLatencyMode: false,
                      backBufferLength: preloadEnabled ? 30 : 0,
                      maxBufferLength: preloadEnabled ? 30 : 0,
                      maxMaxBufferLength: preloadEnabled ? 600 : 0,
                      maxBufferSize: preloadEnabled ? 60 * 1000 * 1000 : 0, // 60MB
                      maxBufferHole: 0.5,
                      highBufferWatchdogPeriod: 2,
                      nudgeOffset: 0.2,
                      nudgeMaxRetry: 5,
                      maxFragLookUpTolerance: 0.25,
                      liveSyncDurationCount: 3,
                      liveMaxLatencyDurationCount: 10,
                      liveDurationInfinity: true,
                      liveBackBufferLength: 0,
                      liveTolerance: 15,
                      progressive: false,
                      debug: false,
                      // Preloading settings
                      enableSoftwareAES: true,
                      // Disable preloading when toggle is off
                      ...(preloadEnabled ? {} : {
                        maxBufferLength: 0,
                        maxMaxBufferLength: 0,
                        backBufferLength: 0,
                        maxBufferSize: 0,
                      })
                    }
                  },
                }}
                onError={(e) => console.error('Player error:', e)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Current URL:</strong> {videoUrl}</p>
              <p><strong>Preloading:</strong> {preloadEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
