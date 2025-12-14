import { GripVertical, Plus, Trash2, X, Play } from 'lucide-react'
import { Button } from './ui/button'

const QueueManager = ({ open, queue, currentIndex, isActive, onRemove, onReorder, onAdd, onClose, onStartQueue }) => {
    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', index)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e, dropIndex) => {
        e.preventDefault()
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
        if (dragIndex !== dropIndex) {
            onReorder(dragIndex, dropIndex)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        if (mins >= 60) {
            const hrs = Math.floor(mins / 60)
            const remainMins = mins % 60
            return `${hrs}h ${remainMins}m`
        }
        return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
    }

    const getTotalTime = () => {
        const total = queue.reduce((sum, time) => sum + time, 0)
        return formatTime(total)
    }

    const presets = [
        { label: '5m', value: 300 },
        { label: '10m', value: 600 },
        { label: '15m', value: 900 },
        { label: '20m', value: 1200 },
        { label: '30m', value: 1800 },
        { label: '1h', value: 3600 },
    ]

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/80"
                onClick={onClose}
            />
            <div 
                className="relative z-50 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
                        <div>
                            <h2 className="text-xl font-bold text-white">Countdown Queue</h2>
                            <p className="text-sm text-gray-300">
                                {queue.length} items • Total: {getTotalTime()}
                                {!isActive && queue.length > 0 && (
                                    <span className="ml-2 text-yellow-400">• Ready to start</span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Quick Add Presets */}
                    <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-600">
                        <div className="text-sm text-gray-300 mb-2">Quick Add</div>
                        <div className="grid grid-cols-6 gap-2">
                            {presets.map((preset) => (
                                <Button
                                    key={preset.value}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAdd(preset.value)}
                                    className="text-xs"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="max-h-96 overflow-y-auto p-4">
                        {queue.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p>No countdowns in queue</p>
                                <p className="text-sm mt-2">Add countdowns using the buttons above</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {queue.map((time, index) => (
                                    <div
                                        key={index}
                                        draggable={!isActive}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            !isActive ? 'cursor-move' : ''
                                        } ${
                                            index === currentIndex && isActive
                                                ? 'bg-blue-600/30 border-2 border-blue-500'
                                                : 'bg-gray-700/50 border-2 border-transparent hover:border-gray-600'
                                        }`}
                                    >
                                        {!isActive && (
                                            <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium">
                                                    {formatTime(time)}
                                                </span>
                                                {index === currentIndex && isActive && (
                                                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Position {index + 1} of {queue.length}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onRemove(index)}
                                            className="p-2 hover:bg-red-600/20 rounded transition-colors"
                                            disabled={index === currentIndex && isActive}
                                        >
                                            <Trash2 className={`w-4 h-4 ${
                                                index === currentIndex && isActive ? 'text-gray-600' : 'text-red-400'
                                            }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg border-t border-gray-600">
                        {!isActive && queue.length > 0 && (
                            <Button
                                onClick={onStartQueue}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Start Queue
                            </Button>
                        )}
                        <Button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QueueManager
