import clsx from 'clsx'
import ReactPlayer from 'react-player'

export const VideoPlayer = ({
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
        showPlayer ? 'block' : 'hidden', // ⭐️ Simplest way to preload
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
