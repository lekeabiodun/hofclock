import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCountdown } from '../hooks/useCountdown'

describe('useCountdown', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should initialize with given time', () => {
        const { result } = renderHook(() => useCountdown(60))
        expect(result.current.timeLeft).toBe(60)
        expect(result.current.isRunning).toBe(false)
    })

    it('should start countdown when start is called', () => {
        const { result } = renderHook(() => useCountdown(60))
        
        act(() => {
            result.current.start()
        })

        act(() => {
            vi.advanceTimersByTime(1000)
        })

        expect(result.current.timeLeft).toBe(59)
    })

    it('should pause and resume countdown', () => {
        const { result } = renderHook(() => useCountdown(60))
        
        act(() => {
            result.current.start()
        })
        
        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current.timeLeft).toBe(59)

        act(() => {
            result.current.pause()
        })
        expect(result.current.isPaused).toBe(true)

        act(() => {
            vi.advanceTimersByTime(2000)
        })
        expect(result.current.timeLeft).toBe(59) // Should not change

        act(() => {
            result.current.resume()
        })

        act(() => {
            vi.advanceTimersByTime(1000)
        })
        expect(result.current.timeLeft).toBe(58)
    })

    it('should call onComplete when countdown reaches 0', () => {
        const onComplete = vi.fn()
        const { result } = renderHook(() => useCountdown(3, { onComplete }))
        
        act(() => {
            result.current.start()
        })

        act(() => {
            vi.advanceTimersByTime(3000)
        })

        expect(result.current.timeLeft).toBe(0)
        expect(onComplete).toHaveBeenCalledTimes(1)
        expect(result.current.isRunning).toBe(false)
    })

    it('should reset countdown', () => {
        const { result } = renderHook(() => useCountdown(60))
        
        act(() => {
            result.current.start()
            vi.advanceTimersByTime(1000)
            result.current.reset()
        })

        expect(result.current.timeLeft).toBe(60)
        expect(result.current.isRunning).toBe(false)
        expect(result.current.isPaused).toBe(false)
    })
})
