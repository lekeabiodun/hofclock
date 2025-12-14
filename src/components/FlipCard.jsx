import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

const FlipCard = ({ value, previousValue }) => {
    const [isFlipping, setIsFlipping] = useState(false)
    const [displayValue, setDisplayValue] = useState(value)
    const { theme } = useTheme()

    useEffect(() => {
        // Sync displayValue when not flipping
        if (!isFlipping) {
            setDisplayValue(value)
        }
    }, [value, isFlipping])

    useEffect(() => {
        if (value !== previousValue) {
            setIsFlipping(true)
            // Update bottom half after top half starts flipping (300ms delay)
            const updateTimer = setTimeout(() => {
                setDisplayValue(value)
            }, 300)
            // Complete flip animation
            const completeTimer = setTimeout(() => {
                setIsFlipping(false)
            }, 600)
            return () => {
                clearTimeout(updateTimer)
                clearTimeout(completeTimer)
            }
        }
    }, [value, previousValue])

    const fontStyle = {
        fontFamily: "'Orbitron', 'Arial Black', Arial, sans-serif",
        fontSize: '14.5rem',
        fontWeight: '900',
        WebkitTextStroke: '2px rgba(0, 0, 0, 0.3)',
        textShadow: `0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px ${theme.glowColor}`,
    }

    return (
        <div className="relative w-28 h-48 sm:w-36 sm:h-64 md:w-44 md:h-72 lg:w-52 lg:h-80 flip-card-container">
            <div className="absolute inset-0 flex flex-col shadow-2xl rounded-xl" 
                 style={{ 
                     transformStyle: 'preserve-3d',
                     boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px ${theme.glowColor}`
                 }}>
                {/* Top half - Shows bottom portion of the number */}
                <div className="relative h-1/2 overflow-hidden rounded-t-xl">
                    {/* Static background showing new value */}
                    <div className="absolute inset-0" style={{ background: theme.cardGradientTop }}>
                        <div
                            className="absolute inset-x-0 flex items-center justify-center"
                            style={{
                                bottom: '0',
                                transform: 'translateY(48%)',
                            }}
                        >
                            <span className="leading-none select-none" 
                                  style={{ ...fontStyle, color: theme.textColor }}>
                                {value}
                            </span>
                        </div>
                    </div>
                    {/* Flip animation top - old value flipping down */}
                    {isFlipping && (
                        <div
                            className="absolute inset-0 rounded-t-xl z-10"
                            style={{
                                background: theme.cardGradientTop,
                                transformOrigin: 'bottom',
                                transformStyle: 'preserve-3d',
                                animation: 'flip-top 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div
                                className="absolute inset-x-0 flex items-center justify-center"
                                style={{
                                    bottom: '0',
                                    transform: 'translateY(48%)',
                                }}
                            >
                                <span className="leading-none select-none" 
                                      style={{ ...fontStyle, color: theme.textColor }}>
                                    {previousValue}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-1 bg-black relative z-10 shadow-inner" />

                {/* Bottom half - Shows top portion of the number */}
                <div className="relative h-1/2 overflow-hidden rounded-b-xl">
                    {/* Static bottom showing current display value */}
                    <div className="absolute inset-0" style={{ background: theme.cardGradientBottom }}>
                        <div
                            className="absolute inset-x-0 flex items-center justify-center"
                            style={{
                                top: '0',
                                transform: 'translateY(-48%)',
                            }}
                        >
                            <span className="leading-none select-none" 
                                  style={{ ...fontStyle, color: theme.textColorBottom }}>
                                {displayValue}
                            </span>
                        </div>
                    </div>
                    {/* Flip animation bottom - new value flipping in */}
                    {isFlipping && (
                        <div
                            className="absolute inset-0 rounded-b-xl z-10"
                            style={{
                                background: theme.cardGradientBottom,
                                transformOrigin: 'top',
                                transformStyle: 'preserve-3d',
                                animation: 'flip-bottom 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div
                                className="absolute inset-x-0 flex items-center justify-center"
                                style={{
                                    top: '0',
                                    transform: 'translateY(-48%)',
                                }}
                            >
                                <span className="leading-none select-none" 
                                      style={{ ...fontStyle, color: theme.textColorBottom }}>
                                    {value}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FlipCard

