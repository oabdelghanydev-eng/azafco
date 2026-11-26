import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string; rest: string[] }> };

/** Any unknown path under a locale renders the localised 404 (app/[locale]/not-found.tsx). */
export default async function CatchAll({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    notFound();
}
