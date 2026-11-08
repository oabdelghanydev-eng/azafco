import { CalendarIcon, ClipboardCheckIcon, DocumentIcon, MailIcon, TruckIcon } from '@/components/v2/icons';

/**
 * Timeline icons for the export process steps (markets_v2.process.steps:
 * request → review → quotation → coordination → shipping documents) and the
 * importer steps (for_importers: request → review → quotation → coordination).
 * Indexed by position.
 */
export const marketStepIcons = [
    <MailIcon key="request" size={24} />,
    <ClipboardCheckIcon key="review" size={24} />,
    <DocumentIcon key="quote" size={24} />,
    <CalendarIcon key="coordination" size={24} />,
    <TruckIcon key="documents" size={24} />,
];
