import { ClipboardCheckIcon, DocumentCheckIcon, MailIcon, TruckIcon } from '@/components/ui/icons';

/**
 * Timeline icons for the four "how to start" steps shared by /markets,
 * /markets/[slug] (markets_v2.process.steps) and /for-importers
 * (importers_v2.process.steps): send requirements -> review with the export
 * team -> agree the order -> pack and ship. Indexed by position.
 * Lucide icons from the design-system set (components/ui/icons.tsx), 24px.
 */
export const marketStepIcons = [
    <MailIcon key="send" size={24} />,
    <ClipboardCheckIcon key="review" size={24} />,
    <DocumentCheckIcon key="agree" size={24} />,
    <TruckIcon key="ship" size={24} />,
];
