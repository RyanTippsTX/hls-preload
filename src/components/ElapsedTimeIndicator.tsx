import { useEffect, useState } from 'react'
import clsx from 'clsx'

export const ElapsedTimeIndicator = ({
  startTime,
  playingAtTime,
}: {
  startTime: Date
  playingAtTime: Date | null
}) => {
  // manage elapsed time
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(new Date().getTime() - startTime.getTime())
    }, 100)
    return () => clearInterval(interval)
  }, [startTime])

  const displayTime = playingAtTime
    ? playingAtTime.getTime() - startTime.getTime()
    : elapsed

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Video Startup Latency</h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'w-3 h-3 rounded-full',
              playingAtTime ? 'bg-green-500' : 'bg-yellow-500 animate-pulse',
            )}
          />
          <span className="text-sm font-medium">
            {playingAtTime ? 'Video Started' : 'Waiting for video...'}
          </span>
        </div>

        <div className="text-2xl font-mono font-bold text-blue-600">
          {(displayTime / 1000).toFixed(2)}s
        </div>
      </div>
    </div>
  )
}
