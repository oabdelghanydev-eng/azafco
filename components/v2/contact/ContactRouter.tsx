'use client';

/**
 * Contact page route selector (brief §19.02–03): "Seafood supply quote" vs
 * "Corporate partnership / other". One RfqForm instance; switching route keeps
 * whatever the visitor already typed in the shared fields.
 */
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';
import RfqForm from '@/components/v2/rfq/RfqForm';
import type { CountryOption } from '@/components/v2/rfq/countries';
import type { Option } from '@/components/v2/rfq/fields';

export type ContactRoute = 'seafood' | 'corporate';

interface Props {
    initialRoute: ContactRoute;
    speciesOptions: Option[];
    countries: CountryOption[];
    prefillSpecies?: string;
    prefillCountry?: string;
}

export default function ContactRouter({ initialRoute, speciesOptions, countries, prefillSpecies, prefillCountry }: Props) {
    const t = useTranslations('contact_v2.routes');
    const [route, setRoute] = useState<ContactRoute>(initialRoute);
    const routesList: ContactRoute[] = ['seafood', 'corporate'];

    return (
        <div className="flex flex-col gap-8">
            <fieldset>
                <legend className="mb-4 font-display text-heading-md text-navy">{t('legend')}</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {routesList.map((r) => {
                        const checked = route === r;
                        return (
                            <label
                                key={r}
                                htmlFor={`contact-route-${r}`}
                                className={cn(
                                    'relative flex cursor-pointer gap-4 rounded-card border-2 bg-white p-5 transition-colors duration-fast motion-reduce:transition-none',
                                    'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy',
                                    checked ? 'border-navy shadow-card' : 'border-line hover:border-line-strong',
                                )}
                            >
                                <input
                                    id={`contact-route-${r}`}
                                    type="radio"
                                    name="contact-route"
                                    value={r}
                                    checked={checked}
                                    onChange={() => setRoute(r)}
                                    className="mt-1 h-5 w-5 shrink-0 accent-navy"
                                    aria-describedby={`contact-route-${r}-text`}
                                />
                                <span>
                                    <span className="block font-display text-heading-sm text-ink">{t(`${r}_title`)}</span>
                                    <span id={`contact-route-${r}-text`} className="mt-1 block text-body-sm text-ink-muted">
                                        {t(`${r}_text`)}
                                    </span>
                                </span>
                            </label>
                        );
                    })}
                </div>
            </fieldset>

            <RfqForm
                topic={route === 'corporate' ? 'corporate' : 'general'}
                prefillSpecies={prefillSpecies}
                prefillCountry={prefillCountry}
                speciesOptions={speciesOptions}
                countries={countries}
                idPrefix="contact"
            />
        </div>
    );
}
