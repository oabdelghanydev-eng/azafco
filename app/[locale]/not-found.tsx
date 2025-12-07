'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';

export default function NotFound() {
    const locale = useLocale();
    const isAr = locale === 'ar';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mt-4">
                    {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
                </h2>
                <p className="text-gray-600 mt-2 mb-8">
                    {isAr
                        ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.'
                        : 'Sorry, the page you are looking for does not exist.'}
                </p>
                <Link
                    href="/"
                    className="btn-primary inline-block"
                >
                    {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
            </div>
        </div>
    );
}
