# i18n Architecture Contract

> **Version:** 1.0.0  
> **Date:** 2026-01-05  
> **Status:** AUTHORITATIVE

---

## Core Principle

**All user-visible text MUST come from locale JSON files.**

There are NO exceptions. If a human can read it, it must be translatable.

---

## Architecture Rules

### RULE 1: Single Source of Truth

| Content Type | Source | Access Method |
|--------------|--------|---------------|
| Translatable text | `locales/[locale]/**/*.json` | `t('path.key')` |
| Non-translatable data | `data/*.ts` | Direct import |

**Non-translatable data** includes ONLY:
- URLs (including map embed URLs)
- Phone numbers
- Email addresses
- Registration numbers
- Image paths
- Flag paths
- Numeric IDs
- Status codes

**ANYTHING ELSE is translatable.**

---

### RULE 2: Data Files Structure

Data files (`data/*.ts`) MUST use `translationKey` pattern:

```typescript
// CORRECT
export const products: Product[] = [
    { id: 1, translationKey: 'tilapia', image: '/items/tilapia.jpg' }
];

// FORBIDDEN
export const companyInfo = {
    name: 'ازافكو',
    nameEn: 'AZAFCO'  // ❌ NEVER put translations in data files
};
```

---

### RULE 3: Access Patterns

**ALLOWED:**
```typescript
// Simple key access
t('home.hero.title')

// Dynamic key with translationKey
t(`data.products.${product.translationKey}.name`)

// Nested keys
t('data.company.addresses.main.address')
```

**FORBIDDEN:**
```typescript
// Binary locale checks for content
locale === 'ar' ? 'Arabic' : 'English'  // ❌

// Accessing .xxxEn or .xxxAr properties
companyInfo.addressEn  // ❌

// Hardcoded translations in components
const questions = { ar: '...', en: '...' }  // ❌
```

---

### RULE 4: RTL Layout Exceptions

The ONLY allowed use of `locale === 'ar'` is for CSS layout:

```typescript
// ALLOWED - Layout only
const dir = locale === 'ar' ? 'rtl' : 'ltr';
className={isAr ? 'space-x-reverse' : ''}
className={isAr ? 'right-2' : 'left-2'}

// FORBIDDEN - Content
text={isAr ? 'عربي' : 'English'}  // ❌
```

---

### RULE 5: Adding a New Language

Adding a new language MUST require **ONLY**:
1. Creating `locales/[new-locale]/` directory
2. Copying and translating JSON files
3. Adding locale to `i18n.ts` locales array

It MUST NOT require:
- Editing any component files
- Adding new conditional branches
- Creating new data file properties

---

### RULE 6: SEO Content

SEO content (meta descriptions, keywords, FAQ schemas) MUST:
- Live in `locales/[locale]/seo/*.json`
- Be accessed via `t()` function
- Never be hardcoded in components

---

## Directory Structure

```
locales/
├── en/
│   ├── common.json           # Shared UI strings
│   ├── navigation.json       # Nav and footer
│   ├── pages/
│   │   ├── home.json
│   │   ├── products.json
│   │   └── ...
│   ├── data/
│   │   ├── products.json     # Product names, descriptions
│   │   ├── markets.json      # Market names, features
│   │   ├── company.json      # Company info (translatable only)
│   │   └── news.json
│   └── seo/
│       ├── metadata.json     # Page titles, descriptions
│       ├── keywords.json     # SEO keywords
│       └── faq.json          # FAQ schema content
├── ar/
│   └── ... (same structure)
└── [other locales]/

data/
├── products.ts              # id, translationKey, image, category
├── markets.ts               # translationKey, flag, since (years), status
├── company.ts               # ONLY: urls, phones, emails, numbers
├── news.ts                  # translationKey, date, image, category
└── certificates.ts          # name (non-translatable), image
```

---

## Validation Checklist

Before merging any PR, verify:

- [ ] No `locale === 'ar' ? text : text` patterns for content
- [ ] No `*.En` or `*.Ar` properties in data files
- [ ] All new strings added to ALL locale files
- [ ] SEO content uses `t()` function
- [ ] `npm run build` succeeds for all locales

---

## Migration Status

| Component | Status | Notes |
|-----------|--------|-------|
| data/products.ts | ✅ CLEAN | Uses translationKey |
| data/markets.ts | ✅ FIXED | Removed sinceAr, uses t('common.coming_soon') |
| data/company.ts | ✅ FIXED | Contains ONLY non-translatable data |
| ContactPageClient | ✅ FIXED | Uses t() for addresses |
| StructuredData | 🔴 NEEDS FIX | 50+ hardcoded strings (Phase 2) |
| page.tsx files | ⚠️ TECH DEBT | Keywords hardcoded for SEO (low priority) |

---

## Future Improvements (Phase 3)

1. **Type-safe keys:** Generate TypeScript types from JSON
2. **Missing key detection:** Build-time validation
3. **JSON schema:** Ensure all locales have same keys
