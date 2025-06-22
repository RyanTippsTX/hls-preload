import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useHlsPreload } from '../hooks/useHlsPreload'
import { VideoPlayer } from '../components/VideoPlayer'
import { PreloadProgress } from '../components/PreloadProgress'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [url, setUrl] = useState('')
  const [showPlayers, setShowPlayers] = useState(false)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [playStartTimes, setPlayStartTimes] = useState<{ preloaded: number | null; regular: number | null }>({
    preloaded: null,
    regular: null
  })
  
  const {
    isPreloading,
    preloadProgress,
    preloadedSegments,
    totalSegments,
    error: preloadError,
    startPreload,
    stopPreload,
    isUrlPreloaded,
  } = useHlsPreload()

  // Sample HLS stream URL - using a public test stream
  const sampleUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

  useEffect(() => {
    // Pre-fill with sample URL
    setUrl(sampleUrl)
  }, [])

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    setShowPlayers(false)
    setShouldPlay(false)
    setPlayStartTimes({ preloaded: null, regular: null })
    
    // Stop any existing preload
    stopPreload()
    
    // Start preloading if URL is valid
    if (newUrl && newUrl.trim()) {
      startPreload(newUrl.trim())
    }
  }

  const handlePlay = () => {
    if (!url.trim()) {
      alert('Please enter a valid HLS stream URL')
      return
    }
    setShowPlayers(true)
    setShouldPlay(true)
  }

  const handlePreloadedPlayStart = () => {
    setPlayStartTimes(prev => ({ ...prev, preloaded: Date.now() }))
  }

  const handleRegularPlayStart = () => {
    setPlayStartTimes(prev => ({ ...prev, regular: Date.now() }))
  }

  const getTimeDifference = () => {
    if (playStartTimes.preloaded && playStartTimes.regular) {
      const diff = playStartTimes.regular - playStartTimes.preloaded
      return diff > 0 ? `+${diff}ms slower` : `${Math.abs(diff)}ms faster`
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">HLS Preloading Demo</h1>
          <p className="text-xl text-gray-300">
            Compare video playback speed with and without HLS preloading using React-Player
          </p>
        </header>

        <div className="space-y-6">
          {/* URL Input Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">HLS Stream URL</h2>
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Enter HLS stream URL..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handlePlay}
                disabled={!url.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                Play Videos
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              The video will start preloading as soon as you enter a URL (before clicking Play)
            </p>
          </div>

          {/* Preload Progress */}
          <PreloadProgress
            isPreloading={isPreloading}
            progress={preloadProgress}
            preloadedSegments={preloadedSegments}
            totalSegments={totalSegments}
            error={preloadError}
          />

          {/* Video Players */}
          {showPlayers && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Video Comparison</h2>
                {getTimeDifference() && (
                  <div className="text-lg text-blue-400 mb-4">
                    Regular player started {getTimeDifference()} than preloaded player
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preloaded Video Player */}
                <VideoPlayer
                  url={url}
                  title="With HLS Preloading ✓"
                  isPreloaded={isUrlPreloaded(url)}
                  playing={shouldPlay}
                  onPlayStart={handlePreloadedPlayStart}
                  onError={(error) => console.error('Preloaded player error:', error)}
                />

                {/* Regular Video Player */}
                <VideoPlayer
                  url={url}
                  title="Without HLS Preloading"
                  isPreloaded={false}
                  playing={shouldPlay}
                  onPlayStart={handleRegularPlayStart}
                  onError={(error) => console.error('Regular player error:', error)}
                />
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">How to Test</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Enter an HLS stream URL above (or use the pre-filled sample)</li>
                  <li>Watch the preloading progress indicator as segments load in the background</li>
                  <li>Click "Play Videos" to start both players simultaneously</li>
                  <li>Compare the startup time and buffering behavior between the two players</li>
                  <li>The preloaded player should start faster and have less buffering</li>
                </ol>
              </div>
            </div>
          )}

          {/* Sample URLs */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Sample HLS Streams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Public Test Streams:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• <button 
                    onClick={() => handleUrlChange('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')}
                    className="text-blue-300 hover:underline"
                  >
                    Mux Test Stream
                  </button></li>
                  <li>• <button 
                    onClick={() => handleUrlChange('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8')}
                    className="text-blue-300 hover:underline"
                  >
                    Sintel Movie (Akamai)
                  </button></li>
                  <li>• <button 
                    onClick={() => handleUrlChange('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8')}
                    className="text-blue-300 hover:underline"
                  >
                    Tears of Steel (Unified Streaming)
                  </button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Note:</h4>
                <p className="text-sm text-gray-300">
                  These are public test streams. For best results, try with your own HLS streams. 
                  The preloading effect is most noticeable with streams that have longer segment durations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
