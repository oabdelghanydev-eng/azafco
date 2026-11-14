/**
 * Country options for the RFQ form (destination, company country, phone prefix).
 * A practical list of trading countries + "Other (type it)". Names are
 * localised on the SERVER with Intl.DisplayNames and passed to the client form
 * as props, so server and browser render identical <option> text.
 *
 * This is a list of selectable countries, NOT a list of AZAFCO markets.
 */

export const RFQ_COUNTRIES: { code: string; dial: string }[] = [
    // Gulf, Levant, North Africa
    { code: 'KW', dial: '965' }, { code: 'AE', dial: '971' }, { code: 'QA', dial: '974' }, { code: 'BH', dial: '973' },
    { code: 'SA', dial: '966' }, { code: 'OM', dial: '968' }, { code: 'IQ', dial: '964' }, { code: 'SY', dial: '963' },
    { code: 'LB', dial: '961' }, { code: 'JO', dial: '962' }, { code: 'PS', dial: '970' }, { code: 'YE', dial: '967' },
    { code: 'EG', dial: '20' }, { code: 'LY', dial: '218' }, { code: 'TN', dial: '216' }, { code: 'DZ', dial: '213' },
    { code: 'MA', dial: '212' }, { code: 'SD', dial: '249' }, { code: 'TR', dial: '90' },
    // Europe
    { code: 'ES', dial: '34' }, { code: 'IT', dial: '39' }, { code: 'DE', dial: '49' }, { code: 'FR', dial: '33' },
    { code: 'NL', dial: '31' }, { code: 'BE', dial: '32' }, { code: 'LU', dial: '352' }, { code: 'GR', dial: '30' },
    { code: 'CY', dial: '357' }, { code: 'MT', dial: '356' }, { code: 'PT', dial: '351' }, { code: 'IE', dial: '353' },
    { code: 'AT', dial: '43' }, { code: 'PL', dial: '48' }, { code: 'CZ', dial: '420' }, { code: 'SK', dial: '421' },
    { code: 'HU', dial: '36' }, { code: 'RO', dial: '40' }, { code: 'BG', dial: '359' }, { code: 'HR', dial: '385' },
    { code: 'SI', dial: '386' }, { code: 'SE', dial: '46' }, { code: 'DK', dial: '45' }, { code: 'FI', dial: '358' },
    { code: 'EE', dial: '372' }, { code: 'LV', dial: '371' }, { code: 'LT', dial: '370' }, { code: 'GB', dial: '44' },
    { code: 'NO', dial: '47' }, { code: 'CH', dial: '41' }, { code: 'RU', dial: '7' }, { code: 'UA', dial: '380' },
    { code: 'GE', dial: '995' }, { code: 'AZ', dial: '994' },
    // Americas
    { code: 'US', dial: '1' }, { code: 'CA', dial: '1' }, { code: 'MX', dial: '52' }, { code: 'BR', dial: '55' },
    // Asia-Pacific
    { code: 'CN', dial: '86' }, { code: 'HK', dial: '852' }, { code: 'JP', dial: '81' }, { code: 'KR', dial: '82' },
    { code: 'SG', dial: '65' }, { code: 'MY', dial: '60' }, { code: 'TH', dial: '66' }, { code: 'VN', dial: '84' },
    { code: 'ID', dial: '62' }, { code: 'PH', dial: '63' }, { code: 'IN', dial: '91' }, { code: 'PK', dial: '92' },
    { code: 'BD', dial: '880' }, { code: 'LK', dial: '94' }, { code: 'AU', dial: '61' }, { code: 'NZ', dial: '64' },
    // Sub-Saharan Africa
    { code: 'NG', dial: '234' }, { code: 'KE', dial: '254' }, { code: 'ET', dial: '251' }, { code: 'GH', dial: '233' },
    { code: 'ZA', dial: '27' },
];

export interface CountryOption {
    code: string;
    name: string;
    dial: string;
}

/** Server-side: localised, alphabetically sorted options. */
export function countryOptions(locale: string): CountryOption[] {
    let names: Intl.DisplayNames | null = null;
    try {
        names = new Intl.DisplayNames([locale, 'en'], { type: 'region' });
    } catch {
        names = null;
    }
    const collator = new Intl.Collator(locale);
    return RFQ_COUNTRIES.map((c) => ({ ...c, name: names?.of(c.code) ?? c.code })).sort((a, b) => collator.compare(a.name, b.name));
}

export function dialFor(code: string): string | undefined {
    return RFQ_COUNTRIES.find((c) => c.code === code)?.dial;
}
