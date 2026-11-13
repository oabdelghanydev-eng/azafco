/**
 * Site v2 component kit. See docs/team/web/site-v2/FOUNDATION.md.
 *
 *   import { Section, SectionHeader, Button, ProductCard } from '@/components/v2';
 *
 * Everything here is hook-light and works in server components except the
 * files marked 'use client' (MobileQuoteBar, RevealSections).
 * The site header and footer are the design G ones (components/g/GHeader,
 * components/g/GFooter), mounted once by app/[locale]/layout.tsx.
 *
 * Visual system = design G (docs/team/web/g/RELEASE-DECISIONS.md): Manrope +
 * IBM Plex Sans Arabic, navy #001B47 / #002D72, gold #F7B500, off-white #F2F5FA,
 * 1320px container, 112px section padding from lg, pill buttons, eyebrows with a
 * 44px gold rule, white cards with a thin border (gold top bar on proof cards).
 */
export { Container, Section, Eyebrow, SectionHeader } from './Layout';
export type { ContainerProps, SectionProps, SectionVariant, SectionSpacing, EyebrowProps, SectionHeaderProps } from './Layout';
export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
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
export { SpeciesRow, SpeciesEntry } from './SpeciesRow';
export type { SpeciesRowProps, SpeciesEntryProps } from './SpeciesRow';
export { default as SpecTable } from './SpecTable';
export type { SpecTableProps, SpecRow } from './SpecTable';
export { default as CertificateCard } from './CertificateCard';
export type { CertificateCardProps } from './CertificateCard';
export { default as MarketCard } from './MarketCard';
export type { MarketCardProps } from './MarketCard';
export { default as InsightCard } from './InsightCard';
export type { InsightCardProps } from './InsightCard';
export { default as FAQAccordion } from './FAQAccordion';
export type { FAQAccordionProps, FAQItem } from './FAQAccordion';
export { default as CTABand } from './CTABand';
export type { CTABandProps } from './CTABand';
export { default as StatPanel } from './StatPanel';
export type { StatPanelProps, Stat } from './StatPanel';
export { default as MediaGallery } from './MediaGallery';
export type { MediaGalleryProps, GalleryItem } from './MediaGallery';
export { default as Pending, SHOW_PENDING } from './Pending';
export type { PendingProps } from './Pending';
export { default as GeoArcs } from './GeoArcs';
export type { GeoArcsProps } from './GeoArcs';
export { default as Logo } from './Logo';
export type { LogoProps, LogoKind } from './Logo';
export { default as HeadingPhoto } from './HeadingPhoto';
export type { HeadingPhotoProps } from './HeadingPhoto';
export { default as FactsStrip, publishedFacts } from './FactsStrip';
export type { FactsStripProps } from './FactsStrip';
export * from './icons';
