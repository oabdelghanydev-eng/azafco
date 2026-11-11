import type { Metadata } from 'next';
import OfferView from './OfferView';

// Hidden air-freight quotation for Kuwait (QR only). noindex / nofollow comes from app/offer/layout.tsx.
// English by default; ?lang=ar opens it in Arabic (RTL). Content and prices live in OfferView.tsx.
export const metadata: Metadata = {
  title: 'Air freight fish prices, Kuwait | AZAFCO International',
  description: 'Fresh chilled fish delivered to Kuwait Airport (KWI): carton prices in KWD for two shipment sizes.',
};

export default function OfferPage() {
  return <OfferView />;
}
