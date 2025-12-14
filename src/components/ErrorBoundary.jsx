import React from 'react'
import { Button } from './ui/button'
import { RefreshCw } from 'lucide-react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('HOF Clock Error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-red-500">Something went wrong</h1>
                    <p className="mb-6 text-gray-300 max-w-md">
                        The application encountered an unexpected error. We apologize for the inconvenience.
                    </p>
                    <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left w-full max-w-md overflow-auto max-h-40">
                        <code className="text-xs text-red-300 font-mono">
                            {this.state.error && this.state.error.toString()}
                        </code>
                    </div>
                    <Button 
                        onClick={this.handleReset}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Application
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
