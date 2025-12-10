'use client';

/**
 * OptimizedImage Component
 * 
 * A wrapper around next/image with:
 * - Lazy loading by default
 * - Blur placeholder
 * - Responsive sizing
 * - Error handling
 */

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
    quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    fill = false,
    priority = false,
    className = '',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality = 75
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Fallback image for errors
    const fallbackSrc = '/images/placeholder.jpg';

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const imageProps = {
        src: hasError ? fallbackSrc : src,
        alt,
        quality,
        priority,
        sizes,
        onLoad: handleLoad,
        onError: handleError,
        className: `
            ${className}
            transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
        `.trim(),
    };

    if (fill) {
        return (
            <div className="relative w-full h-full">
                <Image
                    {...imageProps}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <Image
                {...imageProps}
                width={width || 400}
                height={height || 300}
            />
            {isLoading && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded"
                    style={{ width: width || 400, height: height || 300 }}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
