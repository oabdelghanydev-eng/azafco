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
        // v2 brand + neutrals (design G: navy #001B47 / #002D72, gold #F7B500, off-white #F2F5FA)
        navy: {
          DEFAULT: '#002D72',
          50: '#F2F5FA',
          100: '#E8EDF4',
          200: '#C9D3E0',
          300: '#A9B6C8',
          600: '#0A3A82',
          700: '#002D72',
          800: '#00245C',
          900: '#001B47', // G section / hero navy
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
          DEFAULT: '#0D1F3F', // G body/heading ink (16.6:1 on white)
          muted: '#4A5A75',   // G secondary text (6.9:1 white, 6.4:1 off-white)
          subtle: '#5A6677',  // captions/meta (5.8:1 white, 5.4:1 off-white)
        },
        surface: {
          DEFAULT: '#FFFFFF',
          offwhite: '#F2F5FA', // G off-white
          mist: '#E8EDF4',
        },
        line: {
          DEFAULT: '#D5DDE9',  // G card / control borders (decorative)
          soft: '#E3E8F0',     // G hairline dividers
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
        // G kit (surface-aware): card border, standalone links, big figures, timeline line
        edge: 'var(--v2-line)',
        link: 'var(--v2-link)',
        'link-hover': 'var(--v2-link-hover)',
        stat: 'var(--v2-stat)',
        connector: 'var(--v2-connector)',
      },
      // ── v2 design tokens (site v2) ──────────────────────────────────────
      // Brand: navy #002D72, gold #F7B500. Gold is NEVER used for text on
      // light surfaces (1.82:1). See docs/team/web/site-v2/FOUNDATION.md.
      // `navy-*`, `gold-*`, `ink-*`, `surface-*`, `line-*` and the surface-aware
      // `fg`, `fg-muted`, `eyebrow`, `rule` names are new; the old primary/
      // secondary scales stay for routes not yet rebuilt.
      fontFamily: {
        // Old pages use `font-arabic`; it now resolves to the v2 body stack
        // (design G: Manrope for Latin, IBM Plex Sans Arabic for Arabic glyphs).
        'arabic': ['var(--v2-font-body)', 'system-ui', 'sans-serif'],
        'body': ['var(--v2-font-body)', 'system-ui', 'sans-serif'],
        'display': ['var(--v2-font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Design G type scale. Sizes, line-heights, tracking and weights come from
        // CSS variables (app/globals.css) so Arabic gets its own size/leading/weight
        // and no negative tracking. h1 (heroes) clamp(36px, 5vw, 72px); h2 29px → 50px.
        'display-2xl': ['var(--v2-fs-h1-lg)', { lineHeight: 'var(--v2-lh-display)', letterSpacing: 'var(--v2-ls-display)', fontWeight: 'var(--v2-fw-display)' }],
        'display-xl': ['var(--v2-fs-h1)', { lineHeight: 'var(--v2-lh-display)', letterSpacing: 'var(--v2-ls-display)', fontWeight: 'var(--v2-fw-display)' }],
        'display-lg': ['var(--v2-fs-h2)', { lineHeight: 'var(--v2-lh-h2)', letterSpacing: 'var(--v2-ls-display)', fontWeight: 'var(--v2-fw-display)' }],
        'heading-xl': ['var(--v2-fs-h2-sm)', { lineHeight: 'var(--v2-lh-h2)', letterSpacing: 'var(--v2-ls-heading)', fontWeight: 'var(--v2-fw-display)' }],
        'heading-lg': ['var(--v2-fs-h3-lg)', { lineHeight: 'var(--v2-lh-heading)', letterSpacing: 'var(--v2-ls-heading)', fontWeight: 'var(--v2-fw-h3)' }],
        'heading-md': ['var(--v2-fs-h3)', { lineHeight: 'var(--v2-lh-heading)', fontWeight: 'var(--v2-fw-h3)' }],
        'heading-sm': ['var(--v2-fs-h4)', { lineHeight: 'var(--v2-lh-heading)', fontWeight: '700' }],
        'body-lg': ['var(--v2-fs-body-lg)', { lineHeight: 'var(--v2-lh-body)' }],
        'body': ['var(--v2-fs-body)', { lineHeight: 'var(--v2-lh-body)' }],
        'body-sm': ['var(--v2-fs-body-sm)', { lineHeight: 'var(--v2-lh-body)' }],
        'caption': ['var(--v2-fs-caption)', { lineHeight: '1.5' }],
        'overline': ['var(--v2-fs-overline)', { lineHeight: '1.4', letterSpacing: 'var(--v2-ls-overline)', fontWeight: 'var(--v2-fw-overline)' }],
        // Big figures (G stats strip: 42px → 56px)
        'figure': ['clamp(2.625rem, 2rem + 1.6vw, 3.5rem)', { lineHeight: '1', letterSpacing: 'var(--v2-ls-display)', fontWeight: 'var(--v2-fw-display)' }],
      },
      maxWidth: {
        'v2': '82.5rem',      // 1320px content container (design G)
        'prose-v2': '42rem',  // comfortable measure for body copy
      },
      borderRadius: {
        'control': '6px',
        'card': '4px',        // design G cards and photos
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0, 27, 71, 0.05), 0 4px 14px rgba(0, 27, 71, 0.05)',
        'raised': '0 18px 40px rgba(0, 27, 71, 0.16)', // G dropdown / hover lift
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
