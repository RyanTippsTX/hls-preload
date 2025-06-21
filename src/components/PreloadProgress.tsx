interface PreloadProgressProps {
  isPreloading: boolean
  progress: number
  preloadedSegments: number
  totalSegments: number
  error: string | null
}

export function PreloadProgress({ 
  isPreloading, 
  progress, 
  preloadedSegments, 
  totalSegments, 
  error 
}: PreloadProgressProps) {
  if (!isPreloading && !error) {
    return null
  }

  return (
    <div className="bg-blue-900 rounded-lg p-4 max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">
        HLS Preloading Status
      </h3>
      
      {error ? (
        <div className="text-red-300">
          <div className="font-semibold">Error:</div>
          <div>{error}</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-blue-200">
            <span>Preloading segments...</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          
          <div className="w-full bg-blue-700 rounded-full h-2">
            <div 
              className="bg-blue-300 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          
          <div className="text-sm text-blue-200">
            <div>Preloaded: {preloadedSegments} segments</div>
            {totalSegments > 0 && (
              <div>Total: {totalSegments} segments</div>
            )}
          </div>
          
          <div className="text-xs text-blue-300">
            ✓ HLS manifest and segments are being loaded in the background
          </div>
        </div>
      )}
    </div>
  )
} 