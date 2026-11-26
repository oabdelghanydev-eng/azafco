/**
 * "AZAFCO" ice wordmark from the G boards: letters filled with the fish-on-ice
 * photo through an SVG pattern, faded in from the top by a gradient mask, over a
 * faint white base. Decorative (aria-hidden); one instance per page (fixed ids).
 */
const WORDMARK_D =
    'M61.155 306.907L4.08 431.587L38.72 431.587L49.664 406.967L101.82 406.967L112.082 431.587L146.367 431.587L92.944 306.907L61.155 306.907ZM302.763 306.907L249.562 431.587L283.25 431.587L293.617 406.967L343.856 406.967L354.223 431.587L388.254 431.587L335.386 306.907L302.763 306.907ZM394.507 306.907L478.267 306.907L478.267 334.407L426.477 334.407L426.477 359.337L466.117 359.337L466.117 384.277L426.477 384.277L426.477 431.587L394.507 431.587ZM149.937 306.907L246.807 306.907L246.807 328.007L191.519 403.457L246.807 403.457L246.807 431.587L149.937 431.587L149.937 407.094L203.148 334.407L149.937 334.407ZM76.087 342.707L91.757 381.717L61.057 381.717ZM318.417 342.707L334.087 381.717L303.387 381.717ZM669.374 303.707C629.495 303.707 601.06 331.678 601.06 369.381C601.06 413.77 632.709 436.067 666.953 436.067C707.467 436.067 734.795 407.583 734.795 370.016C734.795 324.43 699.015 303.707 669.374 303.707ZM668.333 332.495C686.542 332.495 702.045 348.684 702.045 369.581C702.045 387.838 690.208 407.367 668.327 407.367C650.233 407.367 633.505 393.491 633.505 370.175C633.505 351.042 645.62 332.495 668.333 332.495ZM598.867 327.551L598.434 327.009C581.917 306.327 557.02 303.707 547.828 303.707C509.246 303.707 481.345 333.172 481.345 370.262C481.345 404.666 504.503 436.067 549.402 436.067C568.256 436.067 589.754 425.211 600.464 409.506L601.072 408.615L581.293 388.836L580.548 389.794C569.21 404.377 558.897 407.305 550.3 407.305C524.898 407.305 514.131 386.497 514.131 368.907C514.131 350.689 528.656 332.366 548.999 332.366C558.813 332.366 573.167 339.032 580.048 349.154L598.867 327.551Z';

// Through the Next image optimizer (640 w is in next.config deviceSizes; the texture sits at low opacity behind a fade mask, so 640 is enough, q 75 in qualities):
// the SVG <image> loads eagerly on every page, so keep it light (AVIF/WebP by Accept).
const PHOTO = `/_next/image?url=${encodeURIComponent('/images/g/fish-on-ice.webp')}&w=640&q=75`;

export default function GFooterWordmark() {
    return (
        <svg viewBox="0 300 739 120" width="100%" preserveAspectRatio="xMidYMax meet" className="block" aria-hidden="true" focusable="false">
            <defs>
                <pattern id="g-wd-p" patternUnits="userSpaceOnUse" x="0" y="300" width="739" height="140">
                    <image href={PHOTO} x="0" y="300" width="739" height="140" preserveAspectRatio="xMidYMid slice" />
                </pattern>
                <linearGradient id="g-wd-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0" />
                    <stop offset=".45" stopColor="#fff" stopOpacity=".55" />
                    <stop offset="1" stopColor="#fff" stopOpacity="1" />
                </linearGradient>
                <mask id="g-wd-m" maskUnits="userSpaceOnUse" x="0" y="300" width="739" height="120">
                    <rect x="0" y="300" width="739" height="120" fill="url(#g-wd-g)" />
                </mask>
            </defs>
            <g mask="url(#g-wd-m)">
                <path fillRule="evenodd" d={WORDMARK_D} fill="rgba(255,255,255,.10)" />
                <path fillRule="evenodd" d={WORDMARK_D} fill="url(#g-wd-p)" stroke="rgba(255,255,255,.4)" strokeWidth=".6" />
            </g>
        </svg>
    );
}
