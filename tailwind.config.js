/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005ab3',
          700: '#004080',
          800: '#00264d',
          900: '#000d1a',
        },
        secondary: {
          50: '#fff4e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa21a',
          500: '#ff8f00',
          600: '#cc7200',
          700: '#995500',
          800: '#663900',
          900: '#331c00',
        },
        // v2 brand + neutrals
        navy: {
          DEFAULT: '#002D72',
          50: '#F2F5FA',
          100: '#E8EDF4',
          200: '#C9D3E0',
          300: '#A9B6C8',
          600: '#0A3A82',
          700: '#002D72',
          800: '#00245C',
          900: '#001A44',
          950: '#00112E',
        },
        gold: {
          DEFAULT: '#F7B500',
          50: '#FFFAEB',
          100: '#FFF6DB',
          400: '#FFC633',
          500: '#F7B500',
          ink: '#7A5A00', // gold-family TEXT, only on white / gold-50/100
        },
        ink: {
          DEFAULT: '#1B2433', // body text (15.6:1 on white)
          muted: '#4B5768',   // secondary text (7.3:1 white, 6.8:1 off-white)
          subtle: '#5A6677',  // captions/meta (5.8:1 white, 5.4:1 off-white)
        },
        surface: {
          DEFAULT: '#FFFFFF',
          offwhite: '#F5F7FA',
          mist: '#E8EDF4',
        },
        line: {
          DEFAULT: '#DCE3EC',  // decorative dividers
          strong: '#8794A8',   // form-control borders (3.07:1, meets 1.4.11)
        },
        // Surface-aware (set by <Section variant>, see globals.css)
        fg: 'var(--v2-fg)',
        'fg-muted': 'var(--v2-fg-muted)',
        eyebrow: 'var(--v2-eyebrow)',
        rule: 'var(--v2-rule)',
        tint: 'var(--v2-tint)',
        'tint-strong': 'var(--v2-tint-strong)',
        panel: 'var(--v2-panel)',
        'btn2': 'var(--v2-btn2-bg)',
        'btn2-fg': 'var(--v2-btn2-fg)',
        'btn2-hover': 'var(--v2-btn2-hover)',
      },
      // ── v2 design tokens (site v2) ──────────────────────────────────────
      // Brand: navy #002D72, gold #F7B500. Gold is NEVER used for text on
      // light surfaces (1.82:1). See docs/team/web/site-v2/FOUNDATION.md.
      // `navy-*`, `gold-*`, `ink-*`, `surface-*`, `line-*` and the surface-aware
      // `fg`, `fg-muted`, `eyebrow`, `rule` names are new; the old primary/
      // secondary scales stay for routes not yet rebuilt.
      fontFamily: {
        // Old pages use `font-arabic`; it now resolves to the v2 body stack
        // (Inter for LTR, IBM Plex Sans Arabic first for Arabic).
        'arabic': ['var(--v2-font-body)', 'system-ui', 'sans-serif'],
        'body': ['var(--v2-font-body)', 'system-ui', 'sans-serif'],
        'display': ['var(--v2-font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial display sizes (fluid). Line-height / tracking come from CSS
        // variables so Arabic gets more leading and no negative tracking.
        'display-2xl': ['clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)', { lineHeight: 'var(--v2-lh-display)', letterSpacing: 'var(--v2-ls-display)', fontWeight: '700' }],
        'display-xl': ['clamp(2.25rem, 1.5rem + 3vw, 4.25rem)', { lineHeight: 'var(--v2-lh-display)', letterSpacing: 'var(--v2-ls-display)', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 1.5rem + 2vw, 3.25rem)', { lineHeight: 'var(--v2-lh-heading)', letterSpacing: 'var(--v2-ls-heading)', fontWeight: '700' }],
        'heading-xl': ['clamp(1.625rem, 1.35rem + 1.1vw, 2.25rem)', { lineHeight: 'var(--v2-lh-heading)', letterSpacing: 'var(--v2-ls-heading)', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: 'var(--v2-lh-heading)', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: 'var(--v2-lh-heading)', fontWeight: '600' }],
        'heading-sm': ['1.0625rem', { lineHeight: 'var(--v2-lh-heading)', fontWeight: '600' }],
        'body-lg': ['var(--v2-fs-body-lg)', { lineHeight: 'var(--v2-lh-body)' }],
        'body': ['var(--v2-fs-body)', { lineHeight: 'var(--v2-lh-body)' }],
        'body-sm': ['0.9375rem', { lineHeight: 'var(--v2-lh-body)' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'overline': ['0.8125rem', { lineHeight: '1.4', letterSpacing: 'var(--v2-ls-overline)', fontWeight: '600' }],
      },
      maxWidth: {
        'v2': '80rem',        // 1280px content container
        'prose-v2': '42rem',  // comfortable measure for body copy
      },
      borderRadius: {
        'control': '6px',
        'card': '10px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0, 26, 68, 0.06), 0 4px 16px rgba(0, 26, 68, 0.06)',
        'raised': '0 8px 32px rgba(0, 26, 68, 0.14)',
        'header': '0 1px 0 rgba(0, 26, 68, 0.08), 0 4px 16px rgba(0, 26, 68, 0.06)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '250ms',
      },
      zIndex: {
        'header': '50',
        'drawer': '60',
        'bar': '40',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
