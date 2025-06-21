import { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface UseHlsPreloadReturn {
  isPreloading: boolean
  preloadProgress: number
  preloadedSegments: number
  totalSegments: number
  error: string | null
  startPreload: (url: string) => void
  stopPreload: () => void
  getPreloadedHls: () => Hls | null
}

export function useHlsPreload(): UseHlsPreloadReturn {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const [preloadedSegments, setPreloadedSegments] = useState(0)
  const [totalSegments, setTotalSegments] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const hlsRef = useRef<Hls | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const startPreload = (url: string) => {
    if (!Hls.isSupported()) {
      setError('HLS is not supported in this browser')
      return
    }

    // Clean up any existing preload
    stopPreload()

    setError(null)
    setIsPreloading(true)
    setPreloadProgress(0)
    setPreloadedSegments(0)
    setTotalSegments(0)

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      maxBufferSize: 60 * 1000 * 1000, // 60MB
      maxBufferHole: 0.5,
      highBufferWatchdogPeriod: 2,
      nudgeOffset: 0.2,
      nudgeMaxRetry: 5,
      maxFragLookUpTolerance: 0.25,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 10,
      liveDurationInfinity: true,
      progressive: false,
      debug: false,
    })

    hlsRef.current = hls

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController()

    hls.loadSource(url)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('Manifest parsed, starting preload')
      setTotalSegments(hls.levels[0]?.details?.fragments?.length || 0)
    })

    hls.on(Hls.Events.FRAG_LOADED, () => {
      setPreloadedSegments(prev => prev + 1)
      
      if (totalSegments > 0) {
        const progress = Math.min((preloadedSegments + 1) / totalSegments, 1)
        setPreloadProgress(progress)
      }
    })

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        setError(`HLS Error: ${data.details}`)
        setIsPreloading(false)
      }
    })
  }

  const stopPreload = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    setIsPreloading(false)
    setPreloadProgress(0)
    setPreloadedSegments(0)
    setTotalSegments(0)
  }

  const getPreloadedHls = () => {
    return hlsRef.current
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPreload()
    }
  }, [])

  return {
    isPreloading,
    preloadProgress,
    preloadedSegments,
    totalSegments,
    error,
    startPreload,
    stopPreload,
    getPreloadedHls,
  }
} 