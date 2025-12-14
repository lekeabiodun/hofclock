import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for managing countdown timer logic
 * @param {number|null} initialTime - Initial time in seconds
 * @param {Object} options - Configuration options
 * @param {Function} options.onComplete - Callback when countdown reaches 0
 * @param {Function} options.onTick - Callback on every tick
 * @param {boolean} options.autoStart - Whether to start immediately
 * @returns {Object} Countdown state and controls
 */
export function useCountdown(initialTime, options = {}) {
    const { onComplete, onTick, autoStart = false } = options
    
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const [isRunning, setIsRunning] = useState(autoStart)
    const [isPaused, setIsPaused] = useState(false)
    const timerRef = useRef(null)
    const completeTriggeredRef = useRef(false)
    const timeLeftRef = useRef(initialTime) // Ref for synchronous access

    // Reset state when initialTime changes
    useEffect(() => {
        if (initialTime !== null) {
            setTimeLeft(initialTime)
            timeLeftRef.current = initialTime // Keep ref in sync
            setIsRunning(autoStart)
            setIsPaused(false)
            completeTriggeredRef.current = false
        } else {
            setIsRunning(false)
            setIsPaused(false)
        }
    }, [initialTime, autoStart])

    const tick = useCallback(() => {
        setTimeLeft((prev) => {
            const newTime = prev > 0 ? prev - 1 : 0
            timeLeftRef.current = newTime // Keep ref in sync
            
            if (onTick) {
                onTick(newTime)
            }

            if (newTime === 0 && !completeTriggeredRef.current) {
                completeTriggeredRef.current = true
                setIsRunning(false)
                if (onComplete) {
                    onComplete()
                }
            }
            
            return newTime
        })
    }, [onComplete, onTick])

    useEffect(() => {
        if (isRunning && !isPaused && timeLeft > 0) {
            timerRef.current = setInterval(tick, 1000)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isRunning, isPaused, tick]) // Removed timeLeft from dependency to prevent interval recreation

    const start = useCallback(() => {
        // Use ref for synchronous access to current timeLeft value
        if (timeLeftRef.current > 0) {
            setIsRunning(true)
            setIsPaused(false)
            completeTriggeredRef.current = false // Reset completion flag
        }
    }, [])

    const pause = useCallback(() => {
        setIsPaused(true)
    }, [])

    const resume = useCallback(() => {
        if (timeLeft > 0) {
            setIsPaused(false)
        }
    }, [timeLeft])

    const stop = useCallback(() => {
        setIsRunning(false)
        setIsPaused(false)
    }, [])

    const reset = useCallback(() => {
        setTimeLeft(initialTime)
        setIsRunning(false)
        setIsPaused(false)
        completeTriggeredRef.current = false
    }, [initialTime])

    // Wrapper to update both state and ref
    const updateTimeLeft = useCallback((newTime) => {
        const time = typeof newTime === 'function' ? newTime(timeLeftRef.current) : newTime
        timeLeftRef.current = time
        setTimeLeft(time)
        completeTriggeredRef.current = false // Reset completion flag when time changes
    }, [])

    return {
        timeLeft,
        isRunning,
        isPaused,
        start,
        pause,
        resume,
        stop,
        reset,
        setTimeLeft: updateTimeLeft // Expose wrapper instead of raw setState
    }
}
