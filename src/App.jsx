import { Clock, Info, Maximize, Pause, Play, RotateCcw, Settings, Timer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AboutDialog from './components/AboutDialog'
import CountdownDialog from './components/CountdownDialog'
import FlipClock from './components/FlipClock'
import OptionsDialog from './components/OptionsDialog'
import QueueDisplay from './components/QueueDisplay'
import QueueManager from './components/QueueManager'
import { ThemeProvider, useTheme } from './components/ThemeProvider'
import { Button } from './components/ui/button'
import { useCountdown } from './hooks/useCountdown'
import { useQueueManager } from './hooks/useQueueManager'
import './index.css'
import { playCountdownAlert } from './lib/sounds'
import { useLocalStorage } from './lib/useLocalStorage'

function AppContent() {
    const [mode, setMode] = useState('clock')
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showCountdownDialog, setShowCountdownDialog] = useState(false)
    const [showOptionsDialog, setShowOptionsDialog] = useState(false)
    const [showAboutDialog, setShowAboutDialog] = useState(false)
    const [showQueueManager, setShowQueueManager] = useState(false)
    const [navVisible, setNavVisible] = useState(true)
    const [isFlashing, setIsFlashing] = useState(false)
    const [isWarningFlash, setIsWarningFlash] = useState(false)
    const navTimeoutRef = useRef(null)
    const { theme } = useTheme()

    // Load options from localStorage with defaults
    const [options, setOptions] = useLocalStorage('hof-clock-options', {
        is24Hour: false,
        showSeconds: false,
        showDate: false,
        soundAlerts: true,
    })

    // Queue Manager Hook
    const {
        queue: countdownQueue,
        currentIndex: currentQueueIndex,
        isActive: isQueueActive,
        isActiveRef, // Ref for synchronous access in callbacks
        currentDuration,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        startQueue,
        nextInQueue,
        stopQueue,
        clearQueue
    } = useQueueManager()

    // Countdown Hook
    const {
        timeLeft: countdownTime,
        isRunning: isCountdownRunning,
        isPaused: isCountdownPaused,
        start: startCountdown,
        pause: pauseCountdown,
        resume: resumeCountdown,
        stop: stopCountdown,
        reset: resetCountdown,
        setTimeLeft: setCountdownTime
    } = useCountdown(null, {
        onComplete: () => {
            // Use ref for synchronous access to current queue state
            const queueIsActive = isActiveRef.current
            console.log('Countdown complete! Queue active:', queueIsActive)

            // Play sound alert
            if (options.soundAlerts) {
                playCountdownAlert()
            }

            // Start background flash (5 seconds)
            setIsFlashing(true)
            setIsWarningFlash(false)

            setTimeout(() => {
                setIsFlashing(false)

                // Check if there are more items in the queue (use ref for current value)
                if (isActiveRef.current) {
                    const nextDuration = nextInQueue()
                    if (nextDuration) {
                        console.log('Moving to next countdown:', nextDuration)
                        setCountdownTime(nextDuration)
                        startCountdown()
                    } else {
                        console.log('Queue complete, returning to clock')
                        handleClockMode()
                    }
                } else {
                    // Single countdown complete
                    handleClockMode()
                }
            }, 5000) // 5 second flash
        }
    })

    // Warning flash when countdown is running low (last 10 seconds)
    useEffect(() => {
        if (mode === 'countdown' && countdownTime !== null) {
            if (countdownTime > 0 && countdownTime <= 10 && isCountdownRunning) {
                setIsWarningFlash(true)
            } else {
                setIsWarningFlash(false)
            }
        } else {
            setIsWarningFlash(false)
        }
    }, [mode, countdownTime, isCountdownRunning])

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    // Auto-hide navigation in fullscreen
    useEffect(() => {
        if (!isFullscreen) {
            setNavVisible(true)
            return
        }

        const handleMouseMove = () => {
            setNavVisible(true)
            if (navTimeoutRef.current) {
                clearTimeout(navTimeoutRef.current)
            }
            navTimeoutRef.current = setTimeout(() => {
                setNavVisible(false)
            }, 3000)
        }

        window.addEventListener('mousemove', handleMouseMove)
        handleMouseMove() // Initial call

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (navTimeoutRef.current) {
                clearTimeout(navTimeoutRef.current)
            }
        }
    }, [isFullscreen])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'f':
                    e.preventDefault()
                    toggleFullscreen()
                    break
                case 'c':
                    e.preventDefault()
                    handleClockMode()
                    break
                case 't':
                    e.preventDefault()
                    setShowCountdownDialog(true)
                    break
                case 'o':
                    e.preventDefault()
                    setShowOptionsDialog(true)
                    break
                case 'q':
                    e.preventDefault()
                    setShowQueueManager(true)
                    break
                case 'p':
                    if (mode === 'countdown') {
                        e.preventDefault()
                        if (isCountdownPaused) resumeCountdown()
                        else pauseCountdown()
                    }
                    break
                case 'escape':
                    if (isFullscreen) {
                        document.exitFullscreen()
                    }
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isFullscreen, mode, isCountdownPaused])

    const handleSetCountdown = (seconds) => {
        // Start countdown immediately (clear queue and start fresh)
        clearQueue()
        addToQueue(seconds) // Add single item to queue for consistency
        startQueue() // Activate queue mode
        setCountdownTime(seconds)
        setMode('countdown')
        startCountdown()
    }

    const handleStartQueue = () => {
        const firstDuration = startQueue()
        if (firstDuration) {
            setCountdownTime(firstDuration)
            setMode('countdown')
            startCountdown()
            setShowQueueManager(false)
        }
    }

    const handleClockMode = () => {
        setMode('clock')
        stopCountdown()
        stopQueue()
    }

    const handleCountdownMode = () => {
        setShowCountdownDialog(true)
    }

    // Format time for screen reader
    const formatTimeForA11y = (seconds) => {
        if (seconds === null) return ''
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins} minutes and ${secs} seconds remaining`
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 animated-gradient relative"
            style={{ background: theme.background }}
        >
            {/* Screen Reader Announcements */}
            <div role="status" aria-live="polite" className="sr-only">
                {mode === 'countdown' && isCountdownRunning && countdownTime % 10 === 0 &&
                    formatTimeForA11y(countdownTime)
                }
            </div>

            {/* Background Flash Overlay - Completion Flash */}
            {isFlashing && (
                <div
                    className="fixed inset-0 pointer-events-none z-50"
                    style={{
                        backgroundColor: theme.accentColor,
                        animation: 'background-flash 0.5s ease-in-out 10'
                    }}
                />
            )}

            {/* Warning Flash Overlay (last 10 seconds) */}
            {isWarningFlash && !isFlashing && (
                <div
                    className="fixed inset-0 pointer-events-none z-50"
                    style={{
                        backgroundColor: theme.accentColor,
                        opacity: 0.3,
                        animation: 'pulse 1s ease-in-out infinite'
                    }}
                />
            )}

            {/* Queue Display Indicator */}
            <QueueDisplay
                queueLength={countdownQueue.length}
                currentIndex={currentQueueIndex}
                isActive={isQueueActive}
                onClick={() => setShowQueueManager(true)}
            />

            {/* Main Clock Display */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <FlipClock
                    mode={mode}
                    countdownTime={countdownTime}
                    options={options}
                />

                {/* Countdown Controls */}
                {mode === 'countdown' && (
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={isCountdownPaused ? resumeCountdown : pauseCountdown}
                            className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                            aria-label={isCountdownPaused ? "Resume countdown" : "Pause countdown"}
                        >
                            {isCountdownPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleClockMode}
                            className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                            aria-label="Stop countdown and return to clock"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div
                className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 px-4 py-3 rounded-full backdrop-blur-sm ${navVisible ? 'nav-visible' : 'nav-hidden'}`}
                style={{
                    backgroundColor: theme.buttonBg,
                    boxShadow: `0 4px 20px ${theme.glowColor}`
                }}
                role="navigation"
                aria-label="Main navigation"
            >
                <Button
                    variant={mode === 'clock' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleClockMode}
                    className="gap-2 button-hover"
                    title="Clock Mode (C)"
                    aria-label="Switch to clock mode (Shortcut: C)"
                    aria-pressed={mode === 'clock'}
                >
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">Clock</span>
                </Button>

                <Button
                    variant={mode === 'countdown' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleCountdownMode}
                    className="gap-2 button-hover"
                    title="Countdown Timer (T)"
                    aria-label="Open countdown timer dialog (Shortcut: T)"
                    aria-pressed={mode === 'countdown'}
                >
                    <Timer className="w-4 h-4" />
                    <span className="hidden sm:inline">Countdown</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="gap-2 button-hover"
                    title="Fullscreen (F or Space)"
                    aria-label={isFullscreen ? "Exit fullscreen (Shortcut: F or Space)" : "Enter fullscreen (Shortcut: F or Space)"}
                >
                    <Maximize className="w-4 h-4" />
                    <span className="hidden sm:inline">Fullscreen</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOptionsDialog(true)}
                    className="gap-2 button-hover"
                    title="Options (O)"
                    aria-label="Open options dialog (Shortcut: O)"
                >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Options</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAboutDialog(true)}
                    className="gap-2 button-hover"
                    title="About"
                    aria-label="Open about dialog"
                >
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">About</span>
                </Button>
            </div>

            {/* Dialogs */}
            <CountdownDialog
                open={showCountdownDialog}
                onOpenChange={setShowCountdownDialog}
                onSetCountdown={handleSetCountdown}
                onAddToQueue={addToQueue}
            />

            <OptionsDialog
                open={showOptionsDialog}
                onOpenChange={setShowOptionsDialog}
                options={options}
                onOptionsChange={setOptions}
            />

            <AboutDialog
                open={showAboutDialog}
                onOpenChange={setShowAboutDialog}
            />

            <QueueManager
                open={showQueueManager}
                onClose={() => setShowQueueManager(false)}
                queue={countdownQueue}
                currentIndex={currentQueueIndex}
                isActive={isQueueActive}
                onRemove={removeFromQueue}
                onReorder={reorderQueue}
                onAdd={addToQueue}
                onStartQueue={handleStartQueue}
            />
        </div>
    )
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    )
}

export default App
