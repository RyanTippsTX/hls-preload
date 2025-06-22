import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
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

// const SegmentLoadingIndicator = ({
//   segmentLoading,
//   loadedSegments,
//   totalSegments,
//   currentSegment,
// }: {
//   segmentLoading: boolean
//   loadedSegments: Array<{ id: string; duration: number; loadedAt: Date }>
//   totalSegments: number
//   currentSegment: number
// }) => {
//   const progress =
//     totalSegments > 0 ? (loadedSegments.length / totalSegments) * 100 : 0

//   return (
//     <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
//       <h2 className="text-xl font-semibold mb-4">
//         HLS Segment Loading Progress
//       </h2>

//       {/* Loading Status */}
//       <div className="flex items-center gap-3 mb-4">
//         <div
//           className={clsx(
//             'w-3 h-3 rounded-full',
//             segmentLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300',
//           )}
//         />
//         <span className="text-sm font-medium">
//           {segmentLoading ? 'Loading segments...' : 'Idle'}
//         </span>
//       </div>

//       {/* Progress Bar */}
//       <div className="mb-4">
//         <div className="flex justify-between text-sm text-gray-600 mb-2">
//           <span>
//             Progress: {loadedSegments.length} / {totalSegments} segments
//           </span>
//           <span>{progress.toFixed(1)}%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div
//             className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       {/* Recent Segments */}
//       {loadedSegments.length > 0 && (
//         <div>
//           <h3 className="text-lg font-medium mb-2">Recently Loaded Segments</h3>
//           <div className="max-h-32 overflow-y-auto space-y-1">
//             {loadedSegments
//               .slice(-5)
//               .reverse()
//               .map((segment, index) => (
//                 <div
//                   key={segment.id}
//                   className="flex justify-between text-sm bg-gray-50 p-2 rounded"
//                 >
//                   <span>Segment {segment.id}</span>
//                   <span className="text-gray-500">
//                     {segment.loadedAt.toLocaleTimeString()} ({segment.duration}
//                     s)
//                   </span>
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
//         <div className="text-center">
//           <div className="font-bold text-blue-600">{loadedSegments.length}</div>
//           <div className="text-gray-600">Loaded</div>
//         </div>
//         <div className="text-center">
//           <div className="font-bold text-gray-600">{totalSegments}</div>
//           <div className="text-gray-600">Total</div>
//         </div>
//         <div className="text-center">
//           <div className="font-bold text-green-600">{currentSegment}</div>
//           <div className="text-gray-600">Current</div>
//         </div>
//       </div>
//     </div>
//   )
// }

const VideoPlayer = ({
  videoSrc,
  showPlayer,
  playing,
  onVideoStart,
}: {
  videoSrc: string
  showPlayer: boolean
  playing: boolean
  onVideoStart: () => void
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
          onPlay={onVideoStart}
          // config={{
          //   file: {
          //     forceHLS: true,
          //     hlsOptions: {
          //       enableWorker: true,
          //       lowLatencyMode: false,
          //       backBufferLength: 30,
          //       maxBufferLength: 30,
          //       maxMaxBufferLength: 600,
          //       maxBufferSize: 60 * 1000 * 1000, // 60MB
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
          //       enableSoftwareAES: true,
          //     },
          //   },
          // }}
        />
      </div>
    </div>
  )
}
