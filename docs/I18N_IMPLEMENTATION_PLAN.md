# i18n Implementation Plan - AZAFCO Website

## Document Metadata
- **Date**: 2026-01-08
- **Status**: Implemented
- **Framework**: Next.js 15.5.7 (App Router)
- **i18n Library**: next-intl v3.25
- **Supported Locales**: ar, en, es, ru, de, fr (6 total)

---

## 1. Executive Summary

### Objective
Migrate from a monolithic locale file structure (`locales/en.json`, `locales/ar.json`) to a domain-driven, scalable architecture supporting 6 locales with proper namespace isolation.

### Scope
- Restructure locale files into domain-specific JSON modules
- Create barrel exports for each locale
- Fix namespace mismatches between components and exports
- Add null safety to `t.raw()` calls
- Centralize OG locale and date formatting maps

---

## 2. Architecture Overview

### 2.1 Directory Structure (Implemented)

```
locales/
├── en/
│   ├── index.ts              # Barrel export
│   ├── common.json           # Shared UI strings
│   ├── navigation.json       # nav + footer
│   ├── pages/
│   │   ├── home.json
│   │   ├── products.json
│   │   ├── about.json
│   │   ├── contact.json
│   │   ├── markets.json
│   │   ├── media.json
│   │   ├── certificates.json
│   │   ├── privacy.json
│   │   └── not-found.json
│   ├── data/
│   │   ├── products.json     # Product catalog translations
│   │   ├── markets.json      # Market descriptions
│   │   ├── news.json         # News content
│   │   └── company.json      # Company info
│   └── seo/
│       ├── metadata.json     # Page meta tags
│       ├── faq.json          # FAQ schema data
│       ├── keywords.json     # SEO keywords
│       └── schema.json       # Structured data labels
├── ar/                       # Same structure
├── de/                       # Same structure
├── es/                       # Same structure
├── fr/                       # Same structure
└── ru/                       # Same structure
```

### 2.2 Barrel Export Structure

```typescript
// locales/*/index.ts
const messages = {
    // Common strings
    common,
    
    // Navigation & Footer
    nav: navigation.nav,
    footer: navigation.footer,
    
    // DUAL EXPORT: Page translations
    // Short names (legacy: t('about.title'))
    about,
    contact,
    products,
    // Full names (_page suffix: t('about_page.xxx'))
    products_page: products,
    markets_page: markets,
    media_page: media,
    about_page: about,
    contact_page: contact,
    certificates_page: certificates,
    privacy,
    not_found: notFound,
    
    // Content data
    data: {
        products: productData,
        markets: marketData,
        news: newsData,
        company: companyData
    },
    
    // SEO
    metadata,
    faq,
    keywords,
    schema
};
```

---

## 3. Design Decisions

### 3.1 Dual Namespace Export Pattern

**Decision**: Export both short (`about`) and suffixed (`about_page`) keys pointing to same JSON.

**Rationale**: The codebase had mixed usage patterns:
- Page headers use: `t('about.title')`
- Page content uses: `t('about_page.timeline_xxx')`

**Trade-off**: 
- ✅ Zero breaking changes to existing components
- ⚠️ Technical debt: Multiple ways to access same data

**Alternative Considered**: Migrate all component usages to consistent `_page` suffix.
- Rejected due to scope (100+ component changes) and risk of regressions.

### 3.2 Domain-Driven File Organization

**Decision**: Split translations by domain (pages/, data/, seo/) rather than flat structure.

**Rationale**:
- Isolation: Changes to product data don't touch page UI strings
- Scalability: Adding new pages requires only new JSON files
- Maintainability: Translators work on focused, smaller files

### 3.3 Data Separation (data.* namespace)

**Decision**: Product/market/news/company data moved to `data.*` namespace.

**Rationale**:
- Clear separation between UI labels and content data
- `t('data.products.tilapia.name')` vs `t('products_page.title')`
- Prevents namespace collision

### 3.4 OG Locale and Date Format Maps

**Decision**: Centralized in `i18n.ts`:

```typescript
export const ogLocaleMap: Record<Locale, string> = {
    ar: 'ar_EG', en: 'en_US', es: 'es_ES',
    ru: 'ru_RU', de: 'de_DE', fr: 'fr_FR'
};

export const dateLocaleMap: Record<Locale, string> = {
    ar: 'ar-EG', en: 'en-US', es: 'es-ES',
    ru: 'ru-RU', de: 'de-DE', fr: 'fr-FR'
};
```

**Rationale**: Eliminates scattered `locale === 'ar' ? 'ar_EG' : 'en_US'` ternaries.

---

## 4. Implementation Details

### 4.1 Files Modified

| Category | Count | Files |
|----------|-------|-------|
| Barrel Exports | 6 | `locales/*/index.ts` |
| Page JSON | 54 | `locales/*/pages/*.json` (9 files × 6 locales) |
| Data JSON | 24 | `locales/*/data/*.json` (4 files × 6 locales) |
| SEO JSON | 24 | `locales/*/seo/*.json` (4 files × 6 locales) |
| Components | 2 | `ProductCard.tsx`, `MarketsPageClient.tsx` |
| Config | 1 | `i18n.ts` |

### 4.2 Null Safety Added

```typescript
// Before (crash risk)
const sizes = t.raw(`data.products.${key}.sizes`) as string[];

// After (null safe)
const sizes = (t.raw(`data.products.${key}.sizes`) ?? []) as string[];
```

Applied to:
- `ProductCard.tsx` line 24
- `MarketsPageClient.tsx` line 144

---

## 5. Validation

### 5.1 Automated Validation Script

```bash
node scripts/validate-i18n.js
# Output: ✅ All locales have matching keys
```

Script verifies:
- All 6 locales have identical key structure
- No missing translations across locales

### 5.2 Build Verification

```bash
npm run build
# Exit code: 0
# All 6 locale routes generated successfully
```

---

## 6. Known Technical Debt

### 6.1 Dual Export Pattern (Medium Risk)

**Issue**: Same translations accessible via two namespaces.
**Impact**: Inconsistent code patterns, confusion for new developers.
**Remediation**: Future refactor to unify on `_page` suffix convention.
**Effort**: 2-4 hours
**Priority**: Low (functional, just inconsistent)

### 6.2 StructuredData Local i18n (Resolved)

**Issue**: Component had 118 lines of embedded translations.
**Resolution**: Migrated to `schema.json` files.

### 6.3 Hardcoded Strings in Original (Resolved)

**Issue**: ProductsPageClient had inline AR/EN conditionals.
**Resolution**: Migrated to JSON with `quality.*` and `cta.*` keys.

---

## 7. Failure Modes

### 7.1 Missing Translation Key

**Behavior**: next-intl returns the key path as string (e.g., `"about_page.xxx"`)
**Detection**: Visual inspection shows raw keys on page
**Mitigation**: validate-i18n.js catches mismatches before deploy

### 7.2 Barrel Export Key Mismatch

**Behavior**: Component shows literal key instead of translated text
**Root Cause**: Export key doesn't match component's `t()` call
**Mitigation**: Dual export pattern covers both naming conventions

### 7.3 t.raw() Returns Undefined

**Behavior**: Previously crashed on `.map()` call
**Resolution**: Added `?? []` fallback

---

## 8. Rollback Plan

### 8.1 Full Rollback

```bash
git revert <commit-range>
```

Returns to monolithic `locales/en.json` structure.

### 8.2 Partial Rollback (Namespace Only)

Modify barrel exports to remove dual pattern:
- Remove `about`, `contact`, `products` short exports
- Keep only `*_page` exports
- Update affected components (3 files, ~10 changes)

---

## 9. Testing Checklist

- [ ] All 6 locale routes render without errors
- [ ] Products page shows translated quality section
- [ ] About page shows translated success story
- [ ] Contact page shows all form labels
- [ ] Privacy page sections render correctly
- [ ] SEO metadata appears in page source
- [ ] Structured data JSON-LD validates

---

## 10. Open Questions

1. **Should we enforce single namespace convention?**
   - Recommendation: Yes, in future cleanup sprint
   
2. **Should validation script run in CI?**
   - Recommendation: Yes, add to pre-commit or CI pipeline
   
3. **Should we add TypeScript types for translation keys?**
   - Recommendation: Consider `next-intl` TypeScript integration

---

## 11. Appendix: Namespace Reference

### Available Top-Level Keys

| Key | Source | Usage Example |
|-----|--------|---------------|
| `common` | common.json | `t('common.learn_more')` |
| `nav` | navigation.json | `t('nav.home')` |
| `footer` | navigation.json | `t('footer.copyright')` |
| `home` | pages/home.json | `t('home.hero.title')` |
| `about` | pages/about.json | `t('about.title')` |
| `about_page` | pages/about.json | `t('about_page.timeline_xxx')` |
| `contact` | pages/contact.json | `t('contact.title')` |
| `contact_page` | pages/contact.json | `t('contact_page.xxx')` |
| `products` | pages/products.json | `t('products.title')` |
| `products_page` | pages/products.json | `t('products_page.xxx')` |
| `markets_page` | pages/markets.json | `t('markets_page.title')` |
| `media_page` | pages/media.json | `t('media_page.title')` |
| `certificates_page` | pages/certificates.json | `t('certificates_page.xxx')` |
| `privacy` | pages/privacy.json | `t('privacy.title')` |
| `not_found` | pages/not-found.json | `t('not_found.title')` |
| `data.products` | data/products.json | `t('data.products.tilapia.name')` |
| `data.markets` | data/markets.json | `t('data.markets.uae.country')` |
| `data.news` | data/news.json | `t('data.news.xxx.title')` |
| `data.company` | data/company.json | `t('data.company.phone')` |
| `metadata` | seo/metadata.json | `t('metadata.home.title')` |
| `faq` | seo/faq.json | `t('faq.items')` |
| `keywords` | seo/keywords.json | `t('keywords.home')` |
| `schema` | seo/schema.json | `t('schema.companyName')` |

---

*End of Implementation Plan*
