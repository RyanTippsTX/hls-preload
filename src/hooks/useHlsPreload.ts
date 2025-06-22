import { useState, useEffect, useRef } from 'react'

interface UseHlsPreloadReturn {
  isPreloading: boolean
  preloadProgress: number
  preloadedSegments: number
  totalSegments: number
  error: string | null
  startPreload: (url: string) => void
  stopPreload: () => void
  isUrlPreloaded: (url: string) => boolean
}

export function useHlsPreload(): UseHlsPreloadReturn {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const [preloadedSegments, setPreloadedSegments] = useState(0)
  const [totalSegments, setTotalSegments] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preloadedUrls, setPreloadedUrls] = useState<Set<string>>(new Set())
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const startPreload = async (url: string) => {
    if (!url || url.trim() === '') {
      return
    }

    // Clean up any existing preload
    stopPreload()

    setError(null)
    setIsPreloading(true)
    setPreloadProgress(0)
    setPreloadedSegments(0)
    setTotalSegments(0)

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController()

    try {
      // Fetch the HLS manifest to get segment information
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.status}`)
      }

      const manifest = await response.text()
      
      // Parse manifest to estimate segment count
      const segmentMatches = manifest.match(/\.ts|\.m4s|\.mp4/g)
      const estimatedSegments = segmentMatches ? segmentMatches.length : 10
      
      setTotalSegments(estimatedSegments)

      // Simulate segment loading based on manifest content
      let loadedSegments = 0
      const segmentInterval = setInterval(() => {
        if (abortControllerRef.current?.signal.aborted) {
          clearInterval(segmentInterval)
          return
        }

        // Simulate variable loading times
        loadedSegments += 1
        
        const progress = Math.min(loadedSegments / estimatedSegments, 1)
        setPreloadProgress(progress)
        setPreloadedSegments(loadedSegments)

        if (progress >= 1) {
          clearInterval(segmentInterval)
          setIsPreloading(false)
          setPreloadedUrls(prev => new Set(prev).add(url))
        }
      }, 300 + Math.random() * 200) // 300-500ms per segment

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Preload was cancelled, don't show error
        return
      }
      
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Preload failed: ${errorMsg}`)
      setIsPreloading(false)
    }
  }

  const stopPreload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    setIsPreloading(false)
    setPreloadProgress(0)
    setPreloadedSegments(0)
    setTotalSegments(0)
  }

  const isUrlPreloaded = (url: string) => {
    return preloadedUrls.has(url)
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
    isUrlPreloaded,
  }
} 