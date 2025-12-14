import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useQueueManager } from '../hooks/useQueueManager'

// Mock useLocalStorage to behave like useState for testing
vi.mock('../lib/useLocalStorage', () => ({
    useLocalStorage: (key, initialValue) => {
        const [val, setVal] = React.useState(initialValue)
        return [val, setVal]
    }
}))

import React from 'react'

describe('useQueueManager', () => {
    it('should initialize with empty queue', () => {
        const { result } = renderHook(() => useQueueManager())
        expect(result.current.queue).toEqual([])
        expect(result.current.currentIndex).toBe(0)
    })

    it('should add items to queue', () => {
        const { result } = renderHook(() => useQueueManager())
        
        act(() => {
            result.current.addToQueue(300)
        })

        expect(result.current.queue).toEqual([300])
    })

    it('should remove items from queue', () => {
        const { result } = renderHook(() => useQueueManager([100, 200, 300]))
        
        act(() => {
            result.current.removeFromQueue(1)
        })

        expect(result.current.queue).toEqual([100, 300])
    })

    it('should start queue', () => {
        const { result } = renderHook(() => useQueueManager([100, 200]))
        
        let firstDuration
        act(() => {
            firstDuration = result.current.startQueue()
        })

        expect(result.current.isActive).toBe(true)
        expect(result.current.currentIndex).toBe(0)
        expect(firstDuration).toBe(100)
    })

    it('should move to next item in queue', () => {
        const { result } = renderHook(() => useQueueManager([100, 200]))
        
        act(() => {
            result.current.startQueue()
        })

        let nextDuration
        act(() => {
            nextDuration = result.current.nextInQueue()
        })

        expect(result.current.currentIndex).toBe(1)
        expect(nextDuration).toBe(200)
    })

    it('should stop queue when finished', () => {
        const { result } = renderHook(() => useQueueManager([100]))
        
        act(() => {
            result.current.startQueue()
        })

        let nextDuration
        act(() => {
            nextDuration = result.current.nextInQueue()
        })

        expect(nextDuration).toBeNull()
        expect(result.current.isActive).toBe(false)
    })
})
