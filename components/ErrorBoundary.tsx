import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-4">🐟</div>
                        <h1 className="text-2xl font-bold text-primary-800 mb-4">
                            عذراً، حدث خطأ ما!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            نعتذر عن هذا الإزعاج. يرجى تحديث الصفحة أو العودة للصفحة الرئيسية.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                            >
                                تحديث الصفحة
                            </button>
                            <a
                                href="/"
                                className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors"
                            >
                                الصفحة الرئيسية
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
