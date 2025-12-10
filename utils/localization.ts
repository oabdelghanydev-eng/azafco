// Supported locales
export type SupportedLocale = 'ar' | 'en' | 'es' | 'ru' | 'de' | 'fr';

// Map locale to field suffix
const suffixMap: Record<string, string> = {
    'en': 'En',
    'es': 'Es',
    'ru': 'Ru',
    'de': 'De',
    'fr': 'Fr'
};

// Helper function to get the correct field based on locale
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedField(
    obj: any,
    baseField: string,
    locale: string
): string {
    const localeKey = locale as SupportedLocale;

    // Arabic uses the base field, other languages use suffix
    if (localeKey === 'ar') {
        return String(obj[baseField] || '');
    }

    const suffix = suffixMap[localeKey] || 'En';
    const fieldName = `${baseField}${suffix}`;

    // If the localized field exists, use it; otherwise fallback to English
    if (fieldName in obj && obj[fieldName]) {
        return String(obj[fieldName]);
    }

    // Fallback to English
    const enField = `${baseField}En`;
    return String(obj[enField] || obj[baseField] || '');
}

// Helper to get localized array field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedArrayField(
    obj: any,
    baseField: string,
    locale: string
): string[] {
    const localeKey = locale as SupportedLocale;

    // Arabic uses the base field, other languages use suffix
    if (localeKey === 'ar') {
        const value = obj[baseField];
        return Array.isArray(value) ? value as string[] : [];
    }

    const suffix = suffixMap[localeKey] || 'En';
    const fieldName = `${baseField}${suffix}`;

    // If the localized field exists, use it; otherwise fallback to English
    if (fieldName in obj && obj[fieldName]) {
        const value = obj[fieldName];
        return Array.isArray(value) ? value as string[] : [];
    }

    // Fallback to English
    const enField = `${baseField}En`;
    const fallbackValue = obj[enField] || obj[baseField];
    return Array.isArray(fallbackValue) ? fallbackValue as string[] : [];
}
