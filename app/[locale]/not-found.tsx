'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function NotFound() {
    const t = useTranslations();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mt-4">
                    {t('not_found.title')}
                </h2>
                <p className="text-gray-600 mt-2 mb-8">
                    {t('common.error')}
                </p>
                <Link
                    href="/"
                    className="btn-primary inline-block"
                >
                    {t('not_found.back_home')}
                </Link>
            </div>
        </div>
    );
}
