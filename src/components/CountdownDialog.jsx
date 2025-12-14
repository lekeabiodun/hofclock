import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

const TimeSpinner = ({ value, onChange, max, label }) => {
    const increment = () => {
        onChange((value + 1) % (max + 1))
    }

    const decrement = () => {
        onChange(value === 0 ? max : value - 1)
    }

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={increment}
                className="w-full py-2 hover:bg-gray-700 rounded-t-lg transition-colors"
            >
                <ChevronUp className="w-6 h-6 mx-auto text-gray-300" />
            </button>
            <div className="bg-gray-800 w-full py-4 text-center border-y border-gray-600">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-gray-400 mt-1">{label}</div>
            </div>
            <button
                onClick={decrement}
                className="w-full py-2 hover:bg-gray-700 rounded-b-lg transition-colors"
            >
                <ChevronDown className="w-6 h-6 mx-auto text-gray-300" />
            </button>
        </div>
    )
}

const CountdownDialog = ({ open, onOpenChange, onSetCountdown, onAddToQueue }) => {
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(5)
    const [seconds, setSeconds] = useState(0)

    const handleStart = () => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        if (totalSeconds > 0) {
            onSetCountdown(totalSeconds)
            onOpenChange(false)
        }
    }

    const handleAddToQueue = () => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        if (totalSeconds > 0) {
            onAddToQueue(totalSeconds)
            // Reset to default
            setHours(0)
            setMinutes(5)
            setSeconds(0)
        }
    }

    const setPreset = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        setHours(h)
        setMinutes(m)
        setSeconds(s)
    }

    const addPresetToQueue = (totalSeconds) => {
        onAddToQueue(totalSeconds)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/80"
                onClick={() => onOpenChange(false)}
            />
            <div 
                className="relative z-50 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
                        <h2 className="text-xl font-bold text-white">Countdown</h2>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Preset Buttons */}
                    <div className="px-6 pt-4 pb-2">
                        <div className="text-sm text-gray-300 mb-2">Quick Add to Queue</div>
                        <div className="grid grid-cols-6 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addPresetToQueue(300)}
                                className="text-xs"
                            >
                                +5m
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addPresetToQueue(600)}
                                className="text-xs"
                            >
                                +10m
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addPresetToQueue(900)}
                                className="text-xs"
                            >
                                +15m
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addPresetToQueue(1200)}
                                className="text-xs"
                            >
                                +20m
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addPresetToQueue(1800)}
                                className="text-xs"
                            >
                                +30m
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addPresetToQueue(3600)}
                                className="text-xs"
                            >
                                +1h
                            </Button>
                        </div>
                    </div>

                    {/* Custom Time Section */}
                    <div className="px-6 py-3 border-t border-gray-600">
                        <div className="text-sm text-gray-300 mb-3">Custom Time</div>
                        {/* Time Spinners */}
                        <div className="bg-gradient-to-b from-gray-300 to-gray-400 p-4 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 bg-gray-900 p-4 rounded-lg">
                                <TimeSpinner
                                    value={hours}
                                    onChange={setHours}
                                    max={23}
                                    label="hr"
                                />
                                <TimeSpinner
                                    value={minutes}
                                    onChange={setMinutes}
                                    max={59}
                                    label="min"
                                />
                                <TimeSpinner
                                    value={seconds}
                                    onChange={setSeconds}
                                    max={59}
                                    label="sec"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-center px-6 py-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg border-t border-gray-600">
                        <Button
                            onClick={handleStart}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                        >
                            Start Now
                        </Button>
                        <Button
                            onClick={handleAddToQueue}
                            variant="outline"
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium border-green-600"
                        >
                            Add to Queue
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium border-gray-600"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CountdownDialog

