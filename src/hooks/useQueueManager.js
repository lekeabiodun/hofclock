import { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'

/**
 * Custom hook for managing countdown queue
 * @param {Array} initialQueue - Initial queue items
 * @returns {Object} Queue state and operations
 */
export function useQueueManager(initialQueue = []) {
    const [queue, setQueue] = useLocalStorage('hof-clock-queue', initialQueue)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isActive, setIsActive] = useState(false)

    // Refs for synchronous access (avoids stale closure issues)
    const queueRef = useRef(queue)
    const currentIndexRef = useRef(currentIndex)
    const isActiveRef = useRef(isActive)

    // Keep refs in sync with state
    useEffect(() => {
        queueRef.current = queue
    }, [queue])

    useEffect(() => {
        currentIndexRef.current = currentIndex
    }, [currentIndex])

    useEffect(() => {
        isActiveRef.current = isActive
    }, [isActive])

    const addToQueue = (time) => {
        setQueue((prev) => [...prev, time])
    }

    const removeFromQueue = (index) => {
        setQueue((prev) => {
            const newQueue = prev.filter((_, i) => i !== index)
            
            // Handle active item removal logic
            if (isActive && index === currentIndex) {
                if (newQueue.length > 0) {
                    // If items remain, stay at current index (or last item)
                    const newIndex = Math.min(currentIndex, newQueue.length - 1)
                    setCurrentIndex(newIndex)
                } else {
                    // Queue empty
                    setIsActive(false)
                    setCurrentIndex(0)
                }
            } else if (isActive && index < currentIndex) {
                // Shift index if removing earlier item
                setCurrentIndex(prev => prev - 1)
            } else if (!isActive && newQueue.length === 0) {
                setCurrentIndex(0)
            }
            
            return newQueue
        })
    }

    const reorderQueue = (fromIndex, toIndex) => {
        setQueue((prev) => {
            const newQueue = [...prev]
            const [removed] = newQueue.splice(fromIndex, 1)
            newQueue.splice(toIndex, 0, removed)
            return newQueue
        })

        // Adjust current index if needed
        if (fromIndex === currentIndex) {
            setCurrentIndex(toIndex)
        } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
            setCurrentIndex(currentIndex - 1)
        } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const startQueue = () => {
        if (queue.length > 0) {
            setCurrentIndex(0)
            setIsActive(true)
            return queue[0]
        }
        return null
    }

    const nextInQueue = () => {
        // Use refs for synchronous access to current values
        const currentQueue = queueRef.current
        const currentIdx = currentIndexRef.current
        
        if (currentIdx < currentQueue.length - 1) {
            const nextIndex = currentIdx + 1
            setCurrentIndex(nextIndex)
            currentIndexRef.current = nextIndex // Update ref immediately
            return currentQueue[nextIndex]
        }
        setIsActive(false)
        isActiveRef.current = false // Update ref immediately
        return null
    }

    const stopQueue = () => {
        setIsActive(false)
        setCurrentIndex(0)
    }

    const clearQueue = () => {
        setQueue([])
        setIsActive(false)
        setCurrentIndex(0)
    }

    return {
        queue,
        currentIndex,
        isActive,
        currentDuration: isActive && queue.length > 0 ? queue[currentIndex] : null,
        // Refs for synchronous access in callbacks
        queueRef,
        currentIndexRef,
        isActiveRef,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        startQueue,
        nextInQueue,
        stopQueue,
        clearQueue,
        setQueue,
        setCurrentIndex,
        setIsActive
    }
}
