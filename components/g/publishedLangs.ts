import { localeConfig, publishedLocales } from '@/i18n';
import type { LangOption } from './langs';

/**
 * Switcher options for the server wrappers (GHeader, GFooter). Server-only:
 * imports '@/i18n', which pulls in next-intl/server. Client files get the
 * result as props.
 */
export function publishedLangs(): LangOption[] {
    return publishedLocales.map((code) => ({ code, nativeName: localeConfig[code].nativeName }));
}
