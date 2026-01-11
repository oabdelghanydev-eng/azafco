'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

/**
 * Functional component for error display - can use hooks for translations
 */
const ErrorFallback: React.FC = () => {
    const t = useTranslations('common')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🐟</div>
                <h1 className="text-2xl font-bold text-primary-800 mb-4">
                    {t('error_title')}
                </h1>
                <p className="text-gray-600 mb-6">
                    {t('error_description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        {t('refresh_page')}
                    </button>
                    <a
                        href="/"
                        className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors"
                    >
                        {t('go_home')}
                    </a>
                </div>
            </div>
        </div>
    )
}

/**
 * ErrorBoundary - Class component required by React for error catching
 * Renders the functional ErrorFallback component which can use translations
 */
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
            return <ErrorFallback />
        }

        return this.props.children
    }
}

export default ErrorBoundary

