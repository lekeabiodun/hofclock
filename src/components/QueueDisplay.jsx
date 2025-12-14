import { List, Play } from 'lucide-react'
import { Button } from './ui/button'

const QueueDisplay = ({ queueLength, currentIndex, isActive, onClick }) => {
    if (queueLength === 0) return null

    const remaining = queueLength - currentIndex - 1

    return (
        <div className="fixed top-6 right-6 z-30">
            <Button
                variant="outline"
                size="lg"
                onClick={onClick}
                className={`gap-2 bg-gray-800/90 backdrop-blur-sm border-2 hover:bg-gray-700 ${
                    !isActive 
                        ? 'ring-4 ring-yellow-500/50 border-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50' 
                        : 'border-blue-500'
                }`}
                title={isActive ? "Manage Queue (Press Q)" : "Queue Ready - Click to Start (Press Q)"}
            >
                {!isActive ? (
                    <>
                        <Play className="w-5 h-5 text-yellow-400" />
                        <span className="text-base font-bold text-yellow-400">
                            {queueLength} queued
                        </span>
                        <span className="text-xs text-yellow-300">
                            Press Q
                        </span>
                    </>
                ) : (
                    <>
                        <List className="w-5 h-5" />
                        <span className="text-base font-semibold">
                            {currentIndex + 1} of {queueLength}
                        </span>
                        {remaining > 0 && (
                            <span className="text-xs text-gray-400">
                                ({remaining} left)
                            </span>
                        )}
                    </>
                )}
            </Button>
        </div>
    )
}

export default QueueDisplay
