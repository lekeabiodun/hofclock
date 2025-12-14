import { createContext, useContext } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { getTheme } from '../lib/themes'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useLocalStorage('hof-clock-theme', 'midnight')
    
    const theme = getTheme(currentTheme)
    
    const changeTheme = (themeId) => {
        setCurrentTheme(themeId)
    }
    
    return (
        <ThemeContext.Provider value={{ theme, currentTheme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
