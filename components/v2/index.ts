/**
 * Site v2 kit blocks (cards, FAQ, spec table, steps...). New code imports the
 * primitives (Container, Section, Button, icons...) from '@/components/ui'
 * (docs/team/web/g/DESIGN-SYSTEM.md); they are no longer re-exported here.
 *
 *   import { ProductCard, FAQAccordion } from '@/components/v2';
 *
 * Removed 14 Nov (no importers; use the ui/ primitive instead): CTABand
 * (offwhite Section + Card accent), MarketCard / CertificateCard (Card),
 * MediaGallery (next/image in the page), FactsStrip / StatPanel (StatStrip,
 * FactCards), v2/SpeciesRow (v2/products/SpeciesRow).
 *
 * Everything here is hook-light and works in server components except the
 * files marked 'use client' (WhatsAppFloat, RevealSections).
 * The site header and footer are the design G ones (components/g/GHeader,
 * components/g/GFooter), mounted once by app/[locale]/layout.tsx.
 *
 * Visual system = design G (docs/team/web/g/RELEASE-DECISIONS.md): Manrope +
 * IBM Plex Sans Arabic, navy #001B47 / #002D72, gold #F7B500, off-white #F2F5FA,
 * 1320px container, 112px section padding from lg, pill buttons, eyebrows with a
 * 44px gold rule, white cards with a thin border (gold top bar on proof cards).
 */
export { default as PageHero } from './PageHero';
export type { PageHeroProps, HeroAction } from './PageHero';
export { default as Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbsProps, Crumb } from './Breadcrumbs';
export { default as ProofStrip } from './ProofStrip';
export type { ProofStripProps, ProofItem } from './ProofStrip';
export { default as ProcessSteps } from './ProcessSteps';
export type { ProcessStepsProps, ProcessStep } from './ProcessSteps';
export { default as FeatureGrid } from './FeatureGrid';
export type { FeatureGridProps, Feature } from './FeatureGrid';
export { default as ProductCard } from './ProductCard';
export type { ProductCardProps } from './ProductCard';
export { default as SpecTable } from './SpecTable';
export type { SpecTableProps, SpecRow } from './SpecTable';
export { default as InsightCard } from './InsightCard';
export type { InsightCardProps } from './InsightCard';
export { default as FAQAccordion } from './FAQAccordion';
export type { FAQAccordionProps, FAQItem } from './FAQAccordion';
export { default as Pending, SHOW_PENDING } from './Pending';
export type { PendingProps } from './Pending';
export { default as GeoArcs } from './GeoArcs';
export type { GeoArcsProps } from './GeoArcs';
export { default as Logo } from './Logo';
export type { LogoProps, LogoKind } from './Logo';
export { default as HeadingPhoto } from './HeadingPhoto';
export type { HeadingPhotoProps } from './HeadingPhoto';
