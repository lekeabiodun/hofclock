import { useEffect, useState } from 'react'
import FlipCard from './FlipCard'
import { useTheme } from './ThemeProvider'

const FlipClock = ({ mode = 'clock', countdownTime = null, options = {} }) => {
    const [time, setTime] = useState(new Date())
    const [previousTime, setPreviousTime] = useState(new Date())
    const [countdown, setCountdown] = useState(countdownTime)
    const [prevCountdown, setPrevCountdown] = useState(countdownTime)
    const { theme } = useTheme()

    // Sync countdown with prop changes
    useEffect(() => {
        if (countdownTime !== null) {
            setCountdown(countdownTime)
            setPrevCountdown(countdownTime)
        }
    }, [countdownTime])

    useEffect(() => {
        if (mode === 'clock') {
            const interval = setInterval(() => {
                setPreviousTime(time)
                setTime(new Date())
            }, 1000)
            return () => clearInterval(interval)
        }
        // Countdown mode: just sync the display when prop changes
        // The actual countdown logic is in App.jsx
        if (mode === 'countdown' && countdownTime !== null) {
            setPrevCountdown(countdown)
            setCountdown(countdownTime)
        }
    }, [mode, time, countdownTime, countdown])

    const getDisplayTime = () => {
        if (mode === 'countdown') {
            const hours = Math.floor(countdown / 3600)
            const minutes = Math.floor((countdown % 3600) / 60)
            const seconds = countdown % 60

            // If countdown is 1 hour or more, show HH:MM (hours:minutes)
            // Otherwise show MM:SS (minutes:seconds)
            if (countdown >= 3600) {
                return {
                    leftPair: String(hours).padStart(2, '0'),
                    rightPair: String(minutes).padStart(2, '0'),
                    seconds: String(seconds).padStart(2, '0'),
                    period: null,
                    isHourMode: true,
                }
            } else {
                return {
                    leftPair: String(minutes).padStart(2, '0'),
                    rightPair: String(seconds).padStart(2, '0'),
                    seconds: null,
                    period: null,
                    isHourMode: false,
                }
            }
        }

        const hours = time.getHours()
        const minutes = time.getMinutes()
        const seconds = time.getSeconds()
        
        // Handle 24-hour format
        if (options.is24Hour) {
            return {
                leftPair: String(hours).padStart(2, '0'),
                rightPair: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
                period: null,
                isHourMode: false,
            }
        }

        // 12-hour format
        const isPM = hours >= 12
        const displayHours = hours % 12 || 12

        return {
            leftPair: String(displayHours).padStart(2, '0'),
            rightPair: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            period: isPM ? 'PM' : 'AM',
            isHourMode: false,
        }
    }

    const getPreviousDisplayTime = () => {
        if (mode === 'countdown') {
            const hours = Math.floor(prevCountdown / 3600)
            const minutes = Math.floor((prevCountdown % 3600) / 60)
            const seconds = prevCountdown % 60

            if (prevCountdown >= 3600) {
                return {
                    leftPair: String(hours).padStart(2, '0'),
                    rightPair: String(minutes).padStart(2, '0'),
                    seconds: String(seconds).padStart(2, '0'),
                    isHourMode: true,
                }
            } else {
                return {
                    leftPair: String(minutes).padStart(2, '0'),
                    rightPair: String(seconds).padStart(2, '0'),
                    seconds: null,
                    isHourMode: false,
                }
            }
        }

        const hours = previousTime.getHours()
        const minutes = previousTime.getMinutes()
        const seconds = previousTime.getSeconds()
        
        // Handle 24-hour format
        if (options.is24Hour) {
            return {
                leftPair: String(hours).padStart(2, '0'),
                rightPair: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
                isHourMode: false,
            }
        }

        // 12-hour format
        const displayHours = hours % 12 || 12

        return {
            leftPair: String(displayHours).padStart(2, '0'),
            rightPair: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            isHourMode: false,
        }
    }

    const displayTime = getDisplayTime()
    const prevDisplayTime = getPreviousDisplayTime()

    // Format date for display
    const formatDate = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            {/* Date display */}
            {mode === 'clock' && options.showDate && (
                <div className="text-xl md:text-2xl font-medium tracking-wide" 
                     style={{ color: theme.textColor, fontFamily: "'Orbitron', sans-serif" }}>
                    {formatDate()}
                </div>
            )}

            {/* Clock display */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
                {/* Left pair - First digit */}
                <FlipCard
                    value={displayTime.leftPair[0]}
                    previousValue={prevDisplayTime.leftPair[0]}
                />
                {/* Left pair - Second digit */}
                <FlipCard
                    value={displayTime.leftPair[1]}
                    previousValue={prevDisplayTime.leftPair[1]}
                />

                {/* Colon separator */}
                <div className="text-6xl md:text-8xl font-bold mx-1" 
                     style={{ color: theme.textColor, fontFamily: "'Orbitron', sans-serif" }}>
                    :
                </div>

                {/* Right pair - First digit */}
                <FlipCard
                    value={displayTime.rightPair[0]}
                    previousValue={prevDisplayTime.rightPair[0]}
                />
                {/* Right pair - Second digit */}
                <FlipCard
                    value={displayTime.rightPair[1]}
                    previousValue={prevDisplayTime.rightPair[1]}
                />

                {/* Seconds display (if enabled) */}
                {options.showSeconds && displayTime.seconds && (
                    <>
                        <div className="text-6xl md:text-8xl font-bold mx-1" 
                             style={{ color: theme.textColor, fontFamily: "'Orbitron', sans-serif" }}>
                            :
                        </div>
                        <FlipCard
                            value={displayTime.seconds[0]}
                            previousValue={prevDisplayTime.seconds[0]}
                        />
                        <FlipCard
                            value={displayTime.seconds[1]}
                            previousValue={prevDisplayTime.seconds[1]}
                        />
                    </>
                )}

                {/* AM/PM indicator (only for 12-hour format) */}
                {mode === 'clock' && displayTime.period && !options.is24Hour && (
                    <div className="relative w-20 h-48 sm:w-24 sm:h-64 md:w-28 md:h-72 lg:w-32 lg:h-80 ml-2 md:ml-3">
                        <div className="absolute inset-0 flex flex-col shadow-2xl rounded-xl overflow-hidden"
                             style={{ boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 10px ${theme.glowColor}` }}>
                            <div className={`flex-1 flex items-center justify-center transition-all duration-300`}
                                 style={{ 
                                     background: displayTime.period === 'AM' ? theme.cardGradientTop : theme.cardGradientBottom,
                                     opacity: displayTime.period === 'AM' ? 1 : 0.5
                                 }}>
                                <span className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-colors`}
                                      style={{ 
                                          color: displayTime.period === 'AM' ? theme.textColor : theme.textColorBottom,
                                          fontFamily: "'Orbitron', sans-serif",
                                          textDecoration: displayTime.period === 'AM' ? 'none' : 'line-through'
                                      }}>
                                    AM
                                </span>
                            </div>
                            <div className="h-1 bg-black shadow-inner" />
                            <div className={`flex-1 flex items-center justify-center transition-all duration-300`}
                                 style={{ 
                                     background: displayTime.period === 'PM' ? theme.cardGradientTop : theme.cardGradientBottom,
                                     opacity: displayTime.period === 'PM' ? 1 : 0.5
                                 }}>
                                <span className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-colors`}
                                      style={{ 
                                          color: displayTime.period === 'PM' ? theme.textColor : theme.textColorBottom,
                                          fontFamily: "'Orbitron', sans-serif",
                                          textDecoration: displayTime.period === 'PM' ? 'none' : 'line-through'
                                      }}>
                                    PM
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FlipClock

