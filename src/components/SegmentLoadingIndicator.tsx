import { useEffect, useState } from 'react'

interface LoadedSegment {
  id: string
  url: string
  loadedAt: Date
  duration?: number
}

export const SegmentLoadingIndicator = () => {
  const [loadedSegments, setLoadedSegments] = useState<LoadedSegment[]>([])

  useEffect(() => {
    // Create a PerformanceObserver that watches for "resource" entries
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.endsWith('.ts')) {
          const segmentId =
            entry.name.split('/').pop()?.replace('.ts', '') || 'unknown'

          const newSegment: LoadedSegment = {
            id: segmentId,
            url: entry.name,
            loadedAt: new Date(),
            duration: entry.duration ? entry.duration / 1000 : undefined,
          }

          setLoadedSegments((prev) => [...prev, newSegment])
        }
      }
    })

    // Start observing resource-loads
    obs.observe({ entryTypes: ['resource'] })

    // Cleanup observer on unmount
    return () => {
      obs.disconnect()
    }
  }, [])

  return (
    <div className="">
      <h3 className="text-sm font-medium mb-2">
        Loaded .ts files: {loadedSegments.length}
      </h3>

      <div className="h-32 overflow-y-auto border border-gray-300 rounded p-2 bg-gray-200">
        {loadedSegments.length > 0 ? (
          <div className="space-y-1">
            {loadedSegments
              .slice(-10)
              .reverse()
              .map((segment) => (
                <div
                  key={`${segment.id}-${segment.loadedAt.getTime()}`}
                  className="text-xs text-gray-600"
                >
                  {segment.id} - {segment.loadedAt.toLocaleTimeString()}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400">No segments loaded yet</div>
        )}
      </div>
    </div>
  )
}
