const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const LOCALES = ['en', 'ar', 'de', 'es', 'fr', 'ru'];
const REFERENCE = 'en';

function getKeys(obj, prefix = '') {
    return Object.entries(obj).flatMap(([k, v]) =>
        typeof v === 'object' && v !== null && !Array.isArray(v)
            ? getKeys(v, `${prefix}${k}.`)
            : [`${prefix}${k}`]
    );
}

function loadLocale(locale) {
    const indexPath = path.join(LOCALES_DIR, locale, 'index.ts');
    // Parse exports from index.ts
    const files = fs.readdirSync(path.join(LOCALES_DIR, locale))
        .filter(f => f.endsWith('.json'));

    const merged = {};
    files.forEach(f => {
        const content = JSON.parse(
            fs.readFileSync(path.join(LOCALES_DIR, locale, f), 'utf8')
        );
        Object.assign(merged, content);
    });

    // Load nested dirs
    ['pages', 'data', 'seo'].forEach(dir => {
        const dirPath = path.join(LOCALES_DIR, locale, dir);
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).filter(f => f.endsWith('.json')).forEach(f => {
                const content = JSON.parse(
                    fs.readFileSync(path.join(dirPath, f), 'utf8')
                );
                const name = f.replace('.json', '');
                merged[name] = content;
            });
        }
    });

    return merged;
}

const refKeys = new Set(getKeys(loadLocale(REFERENCE)));
let hasErrors = false;

LOCALES.filter(l => l !== REFERENCE).forEach(locale => {
    const keys = new Set(getKeys(loadLocale(locale)));

    const missing = [...refKeys].filter(k => !keys.has(k));
    const extra = [...keys].filter(k => !refKeys.has(k));

    if (missing.length) {
        console.error(`\n❌ ${locale}: Missing ${missing.length} keys:`);
        missing.slice(0, 10).forEach(k => console.error(`   - ${k}`));
        if (missing.length > 10) console.error(`   ... and ${missing.length - 10} more`);
        hasErrors = true;
    }

    if (extra.length) {
        console.warn(`\n⚠️  ${locale}: Extra ${extra.length} keys (not in ${REFERENCE})`);
    }
});

if (!hasErrors) {
    console.log('✅ All locales have matching keys');
    process.exit(0);
} else {
    process.exit(1);
}
