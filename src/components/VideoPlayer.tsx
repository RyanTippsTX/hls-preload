import clsx from 'clsx'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

export const VideoPlayer = ({
  videoSrc,
  showPlayer,
  onPlaying,
}: {
  videoSrc: string
  showPlayer: boolean
  onPlaying: () => void
}) => {
  // ReactPlayer events are alllllllll screwed up. "onPlaying" for HLS doesn't fire unless autoplay. So I have to infer from 2 vars. I could use "onProgress" but it fires way too late.
  const [onPlayingEventFired, setOnPlayingEventFired] = useState(false)
  const footageIsActuallyRollingFRFR = onPlayingEventFired && showPlayer
  useEffect(() => {
    if (footageIsActuallyRollingFRFR) onPlaying()
  }, [footageIsActuallyRollingFRFR])

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-lg p-6',
        showPlayer ? 'block' : 'hidden', // ⭐️ Simplest way to preload
      )}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Video Player</h2>
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <ReactPlayer
          url={videoSrc}
          controls={true}
          playing={showPlayer}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onPlaying={() => setOnPlayingEventFired(true)} // see note above
          config={{
            file: {
              forceHLS: true,
              forceSafariHLS: true,
              hlsOptions: {
                // https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
                maxBufferLength: 30,
                maxMaxBufferLength: 600,
                maxBufferSize: 60 * 1000 * 1000, // 60MB default
                backBufferLength: Infinity,
                frontBufferFlushThreshold: Infinity,
                // enableWorker: true,
                // lowLatencyMode: false,
                // backBufferLength: 30,
                // maxBufferSize: 60 * 1000 * 1000, // 60MB
                // maxBufferHole: 0.5,
                // highBufferWatchdogPeriod: 2,
                // nudgeOffset: 0.2,
                // nudgeMaxRetry: 5,
                // maxFragLookUpTolerance: 0.25,
                // liveSyncDurationCount: 3,
                // liveMaxLatencyDurationCount: 10,
                // liveDurationInfinity: true,
                // liveBackBufferLength: 0,
                // liveTolerance: 15,
                // progressive: false,
                // enableSoftwareAES: true,
              },
            },
          }}
        />
      </div>
    </div>
  )
}
