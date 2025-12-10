const fs = require('fs');
const path = require('path');

const locales = ['ar', 'en', 'es', 'ru', 'de', 'fr'];
const keys = {};

console.log('🔍 Starting Translation Key Verification...\n');

locales.forEach(l => {
    try {
        const filePath = path.join('locales', `${l}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Error: File not found: ${filePath}`);
            return;
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const getKeys = (obj, prefix = '') => Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object' && obj[k] !== null) {
                acc.push(...getKeys(obj[k], pre + k));
            } else {
                acc.push(pre + k);
            }
            return acc;
        }, []);

        keys[l] = getKeys(data).sort();
        console.log(`📄 ${l.toUpperCase()}: \t${keys[l].length} keys found.`);
    } catch (e) {
        console.error(`❌ Error reading ${l}: ${e.message}`);
    }
});

const baseLocale = 'en';
const baseKeys = keys[baseLocale];

if (!baseKeys) {
    console.error('❌ Critical Error: English base locale keys missing.');
    process.exit(1);
}

let mismatch = false;

locales.forEach(l => {
    if (l === baseLocale) return;

    if (!keys[l]) {
        console.log(`\n❌ ${l.toUpperCase()} failed to load.`);
        mismatch = true;
        return;
    }

    const missing = baseKeys.filter(k => !keys[l].includes(k));
    const extra = keys[l].filter(k => !baseKeys.includes(k));

    if (missing.length || extra.length) {
        mismatch = true;
        console.log(`\n⚠️ Mismatch in ${l.toUpperCase()}:`);
        if (missing.length) console.log('  🔴 Missing keys:', missing);
        if (extra.length) console.log('  🟡 Extra keys:', extra);
    } else {
        console.log(`✅ ${l.toUpperCase()} matches base locale structure.`);
    }
});

if (!mismatch) {
    console.log('\n🎉 SUCCESS: All 6 language files have identical key structures.');
} else {
    console.log('\n⚠️ WARNING: Consistency issues found.');
    process.exit(1);
}
