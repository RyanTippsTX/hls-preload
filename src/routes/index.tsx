import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ReactPlayer from 'react-player'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [url, setUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLoad = () => {
    if (url.trim()) {
      setIsLoading(true)
      setVideoUrl(url.trim())
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          HLS Video Player Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
              disabled={!url.trim() || isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Load'}
            </button>
          </div>
          
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
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{
                  file: {
                    forceHLS: true,
                  },
                }}
                onError={(e) => console.error('Player error:', e)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Current URL:</strong> {videoUrl}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
