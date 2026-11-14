/**
 * AZAFCO design system: primitives (design G). Rules and tokens:
 * docs/team/web/g/DESIGN-SYSTEM.md.
 *
 *   import { Section, SectionHeading, Button, Card, Icon } from '@/components/ui';
 *   import { MailIcon, WhatsAppIcon } from '@/components/ui';
 *
 * Every primitive is hook-free and renders in server components. Interactive
 * client widgets (header menu, WhatsApp float, carousels) live in their own
 * 'use client' files and are not exported here.
 */
export { cn, focusRing, focusRingLight, focusRingDark, containerClass, sectionY, typography } from './tokens';
export type { TypeRole } from './tokens';

export { Container, Section, Eyebrow, SectionHeader, SectionHeading } from './Layout';
export type { ContainerProps, SectionProps, SectionVariant, SectionSpacing, EyebrowProps, SectionHeaderProps, SectionHeadingProps } from './Layout';

export { Button, LinkButton, buttonClass } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { IconButton } from './IconButton';
export type { IconButtonProps, IconButtonVariant } from './IconButton';

export { TextLink, ExternalLink } from './TextLink';
export type { TextLinkProps, ExternalLinkProps } from './TextLink';

export { Card, cardClass } from './Card';
export type { CardProps } from './Card';

export { Stat, StatStrip, FactCards } from './Stat';
export type { StatItem, StatStripProps, FactItem, FactLink } from './Stat';

export { ContactRow } from './ContactRow';
export type { ContactRowProps } from './ContactRow';

export { Badge, Pill } from './Badge';
export type { BadgeProps, BadgeTone } from './Badge';

export { PageHead } from './PageHead';
export type { PageHeadProps } from './PageHead';

export { default as PageHero } from '@/components/v2/PageHero';
export type { PageHeroProps, HeroAction } from '@/components/v2/PageHero';

export { default as Breadcrumbs } from '@/components/v2/Breadcrumbs';
export type { BreadcrumbsProps, Crumb } from '@/components/v2/Breadcrumbs';

export { Icon, ICON_STROKE } from './Icon';
export type { IconProps as IconComponentProps, IconSize } from './Icon';
export * from './icons';

export { noBreakValue, phoneDisplay } from './format';
