const fs = require('fs');
const path = require('path');

const locales = ['en', 'ar', 'es', 'ru', 'de', 'fr'];
const localesDir = path.join(__dirname, 'locales');
const data = {};

// Load all locale files
locales.forEach(l => {
    const filePath = path.join(localesDir, `${l}.json`);
    data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

// Recursively get all keys from an object
const getKeys = (obj, prefix = '') => {
    let keys = [];
    for (const k in obj) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            keys = keys.concat(getKeys(obj[k], key));
        } else {
            keys.push(key);
        }
    }
    return keys;
};

// Get English keys as baseline
const enKeys = getKeys(data.en).sort();
console.log('=== Locale Files Verification ===\n');
console.log(`English (en.json): ${enKeys.length} keys\n`);

let allMatch = true;

// Compare each locale with English
locales.slice(1).forEach(l => {
    const lKeys = getKeys(data[l]).sort();
    const missing = enKeys.filter(k => !lKeys.includes(k));
    const extra = lKeys.filter(k => !enKeys.includes(k));

    console.log(`${l.toUpperCase()} (${l}.json): ${lKeys.length} keys`);

    if (missing.length > 0) {
        console.log(`  ❌ Missing ${missing.length} keys:`);
        missing.forEach(k => console.log(`     - ${k}`));
        allMatch = false;
    }

    if (extra.length > 0) {
        console.log(`  ⚠️  Extra ${extra.length} keys:`);
        extra.forEach(k => console.log(`     + ${k}`));
    }

    if (missing.length === 0 && extra.length === 0) {
        console.log(`  ✅ All keys match English!`);
    }
    console.log('');
});

// Check for empty values
console.log('=== Checking for Empty Values ===\n');
locales.forEach(l => {
    const emptyKeys = [];
    const checkEmpty = (obj, prefix = '') => {
        for (const k in obj) {
            const key = prefix ? `${prefix}.${k}` : k;
            if (typeof obj[k] === 'object' && obj[k] !== null) {
                checkEmpty(obj[k], key);
            } else if (obj[k] === '' || obj[k] === null || obj[k] === undefined) {
                emptyKeys.push(key);
            }
        }
    };
    checkEmpty(data[l]);

    if (emptyKeys.length > 0) {
        console.log(`${l.toUpperCase()}: ${emptyKeys.length} empty values`);
        emptyKeys.forEach(k => console.log(`  - ${k}`));
    } else {
        console.log(`${l.toUpperCase()}: ✅ No empty values`);
    }
});

console.log('\n=== Summary ===');
if (allMatch) {
    console.log('✅ All locale files have consistent keys!');
} else {
    console.log('❌ Some locale files are missing keys, please fix them.');
}
