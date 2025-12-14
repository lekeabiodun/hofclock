import { useState, useEffect } from 'react'

/**
 * Custom hook for persisting state to localStorage
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if nothing is in localStorage
 * @returns {[*, Function]} - The state value and setter function
 */
export function useLocalStorage(key, initialValue) {
    // Get initial value from localStorage or use initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error loading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Update localStorage when value changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (error) {
            console.error(`Error saving localStorage key "${key}":`, error)
        }
    }, [key, storedValue])

    return [storedValue, setStoredValue]
}
