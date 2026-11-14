#!/usr/bin/env node
/**
 * SEO basics check. Run after `npm run build`:
 *
 *   npm run seo:check                       # starts `next start` on a free port, checks, stops it
 *   npm run seo:check -- --url http://localhost:3000   # check an already running server
 *
 * For every URL in /sitemap.xml (every route x every locale) it verifies:
 *   - <title> present, <= 65 chars, unique within its locale
 *   - meta description present, 50-160 chars, unique within its locale
 *   - exactly one <h1>
 *   - <link rel="canonical"> equals the page's own (sitemap) URL
 *   - hreflang alternates for the published locales (ar/en) + x-default, none for es/ru/de/fr; own-locale alternate = own URL
 *   - at least one JSON-LD block, and every JSON-LD block parses
 *   - every <img> has a non-empty alt (alt="" only with aria-hidden="true" or role="presentation"/"none")
 *
 * Prints a table of failures and exits 1 if there are any. No dependencies beyond Node >= 18.
 */
'use strict';

const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

// Published locales (i18n-config.ts publishedLocales). Any locale listed in
// UNPUBLISHED_LOCALES must NOT appear as an hreflang alternate.
const LOCALES = ['ar', 'en', 'es', 'ru', 'de', 'fr'];
const UNPUBLISHED_LOCALES = [];
const TITLE_MAX = 65;
const DESC_MIN = 50;
const DESC_MAX = 160;
const CONCURRENCY = 6;
// Fetch as a crawler so Next.js renders metadata in <head> (no streamed metadata).
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) azafco-seo-check';

// ---------- args ----------
const args = process.argv.slice(2);
const argVal = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
};
const externalUrl = argVal('--url') || process.env.SEO_CHECK_URL;

// ---------- HTML helpers (regex based; the input is our own SSR output) ----------
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
function decode(s) {
    return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
        if (e[0] === '#') {
            const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
            return Number.isFinite(code) ? String.fromCodePoint(code) : m;
        }
        return ENTITIES[e.toLowerCase()] ?? m;
    });
}

function parseAttrs(tag) {
    const attrs = {};
    const re = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    // skip the tag name
    const body = tag.replace(/^<\s*[^\s>\/]+/, '').replace(/\/?>$/, '');
    let m;
    while ((m = re.exec(body))) {
        const v = m[2] ?? m[3] ?? m[4];
        attrs[m[1].toLowerCase()] = v === undefined ? '' : decode(v);
    }
    return attrs;
}

function tags(html, name) {
    const re = new RegExp(`<${name}\\b[^>]*>`, 'gi');
    return (html.match(re) || []).map(parseAttrs);
}

const textLen = (s) => Array.from(s).length;
const normUrl = (u) => (u || '').replace(/\/+$/, '');

function analyse(html) {
    // JSON-LD blocks before stripping scripts
    const jsonLd = [];
    const ldRe = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = ldRe.exec(html))) jsonLd.push(m[1]);

    // Remove things whose markup must not be counted (scripts incl. RSC payload, styles, inline SVG <title>s, templates)
    const clean = html
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[\s\S]*?<\/style>/gi, '')
        .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
        .replace(/<template\b[\s\S]*?<\/template>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');

    const titles = [];
    const tRe = /<title\b[^>]*>([\s\S]*?)<\/title>/gi;
    while ((m = tRe.exec(clean))) titles.push(decode(m[1]).trim());

    const metas = tags(clean, 'meta');
    const descs = metas.filter((a) => (a.name || '').toLowerCase() === 'description').map((a) => (a.content || '').trim());

    const links = tags(clean, 'link');
    const canonicals = links.filter((a) => (a.rel || '').toLowerCase().split(/\s+/).includes('canonical')).map((a) => a.href);
    const alternates = links
        .filter((a) => (a.rel || '').toLowerCase().split(/\s+/).includes('alternate') && a.hreflang)
        .map((a) => ({ lang: a.hreflang, href: a.href }));

    const h1Count = (clean.match(/<h1\b/gi) || []).length;
    const imgs = tags(clean, 'img');

    return { titles, descs, canonicals, alternates, h1Count, imgs, jsonLd };
}

function checkPage(url, locale, html) {
    const fails = [];
    const add = (check, detail) => fails.push({ url, locale, check, detail });
    const a = analyse(html);

    // title
    if (a.titles.length === 0 || !a.titles[0]) add('title', 'missing');
    else {
        if (a.titles.length > 1) add('title', `${a.titles.length} <title> tags`);
        const len = textLen(a.titles[0]);
        if (len > TITLE_MAX) add('title', `${len} chars (max ${TITLE_MAX}): "${a.titles[0]}"`);
    }

    // description
    if (a.descs.length === 0 || !a.descs[0]) add('description', 'missing');
    else {
        if (a.descs.length > 1) add('description', `${a.descs.length} meta descriptions`);
        const len = textLen(a.descs[0]);
        if (len < DESC_MIN || len > DESC_MAX) add('description', `${len} chars (want ${DESC_MIN}-${DESC_MAX})`);
    }

    // h1
    if (a.h1Count !== 1) add('h1', `${a.h1Count} <h1> elements (want 1)`);

    // canonical
    if (a.canonicals.length === 0) add('canonical', 'missing');
    else if (a.canonicals.length > 1) add('canonical', `${a.canonicals.length} canonical links`);
    else if (normUrl(a.canonicals[0]) !== normUrl(url)) add('canonical', `points to ${a.canonicals[0]}`);

    // hreflang
    const langs = new Map(a.alternates.map((x) => [x.lang.toLowerCase(), x.href]));
    const missing = [...LOCALES, 'x-default'].filter((l) => !langs.has(l));
    if (missing.length) add('hreflang', `missing: ${missing.join(', ')}`);
    const unexpected = UNPUBLISHED_LOCALES.filter((l) => langs.has(l));
    if (unexpected.length) add('hreflang', `unpublished locale alternates: ${unexpected.join(', ')}`);
    if (langs.has(locale) && normUrl(langs.get(locale)) !== normUrl(url)) {
        add('hreflang', `${locale} alternate points to ${langs.get(locale)}`);
    }

    // JSON-LD
    if (a.jsonLd.length === 0) add('json-ld', 'no application/ld+json block');
    a.jsonLd.forEach((raw, i) => {
        try {
            JSON.parse(raw);
        } catch (e) {
            add('json-ld', `block ${i + 1} does not parse: ${e.message}`);
        }
    });

    // img alt
    a.imgs.forEach((img) => {
        const src = img.src || img['data-src'] || (img.srcset || '').split(/[\s,]/)[0] || '?';
        const short = decodeURIComponent(src.replace(/^\/_next\/image\?url=/, '').split('&')[0]);
        if (!('alt' in img)) return add('img-alt', `no alt: ${short}`);
        if (img.alt.trim() === '') {
            const decorative =
                (img['aria-hidden'] || '').toLowerCase() === 'true' ||
                ['presentation', 'none'].includes((img.role || '').toLowerCase());
            if (!decorative) add('img-alt', `empty alt without aria-hidden/role=presentation: ${short}`);
        }
    });

    return { fails, title: a.titles[0], desc: a.descs[0] };
}

// ---------- server ----------
function freePort() {
    return new Promise((resolve, reject) => {
        const srv = net.createServer();
        srv.unref();
        srv.on('error', reject);
        srv.listen(0, () => {
            const { port } = srv.address();
            srv.close(() => resolve(port));
        });
    });
}

async function startServer() {
    const port = await freePort();
    const nextBin = require.resolve('next/dist/bin/next', { paths: [path.join(__dirname, '..')] });
    const child = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
        cwd: path.join(__dirname, '..'),
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production' },
    });
    let log = '';
    child.stdout.on('data', (d) => (log += d));
    child.stderr.on('data', (d) => (log += d));
    const base = `http://127.0.0.1:${port}`;
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null) throw new Error(`next start exited early:\n${log}`);
        try {
            const r = await fetch(`${base}/robots.txt`);
            if (r.ok) return { base, stop: () => child.kill() };
        } catch {
            /* not up yet */
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    child.kill();
    throw new Error(`next start did not answer within 60s:\n${log}`);
}

// ---------- main ----------
async function main() {
    let server;
    let base = externalUrl && externalUrl.replace(/\/+$/, '');
    if (!base) {
        server = await startServer();
        base = server.base;
    }

    try {
        const smRes = await fetch(`${base}/sitemap.xml`, { headers: { 'user-agent': UA } });
        if (!smRes.ok) throw new Error(`GET /sitemap.xml -> ${smRes.status}`);
        const sm = await smRes.text();
        const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1].trim()));
        if (urls.length === 0) throw new Error('sitemap.xml has no <loc> entries');

        const results = [];
        let next = 0;
        async function worker() {
            while (next < urls.length) {
                const url = urls[next++];
                const u = new URL(url);
                const locale = u.pathname.split('/')[1];
                const local = `${base}${u.pathname}${u.search}`;
                let res;
                try {
                    res = await fetch(local, { headers: { 'user-agent': UA }, redirect: 'manual' });
                } catch (e) {
                    results.push({ url, locale, fails: [{ url, locale, check: 'http', detail: e.message }] });
                    continue;
                }
                if (res.status !== 200) {
                    results.push({ url, locale, fails: [{ url, locale, check: 'http', detail: `status ${res.status}` }] });
                    continue;
                }
                results.push({ url, locale, ...checkPage(url, locale, await res.text()) });
            }
        }
        await Promise.all(Array.from({ length: CONCURRENCY }, worker));

        // uniqueness within a locale
        const fails = results.flatMap((r) => r.fails);
        for (const [field, label] of [['title', 'title'], ['desc', 'description']]) {
            const byKey = new Map();
            for (const r of results) {
                if (!r[field]) continue;
                const key = `${r.locale}\u0000${r[field]}`;
                if (!byKey.has(key)) byKey.set(key, []);
                byKey.get(key).push(r.url);
            }
            for (const group of byKey.values()) {
                if (group.length < 2) continue;
                for (const url of group) {
                    const others = group.filter((g) => g !== url).map((g) => new URL(g).pathname);
                    fails.push({ url, locale: new URL(url).pathname.split('/')[1], check: `${label}-unique`, detail: `same as ${others.join(', ')}` });
                }
            }
        }

        report(urls.length, fails);
        return fails.length ? 1 : 0;
    } finally {
        if (server) server.stop();
    }
}

function report(pageCount, fails) {
    if (fails.length === 0) {
        console.log(`SEO check passed: ${pageCount} pages, 0 failures.`);
        return;
    }
    fails.sort((a, b) => a.url.localeCompare(b.url) || a.check.localeCompare(b.check));
    const rows = fails.map((f) => [new URL(f.url).pathname, f.check, f.detail]);
    const head = ['page', 'check', 'detail'];
    const w = [0, 1].map((i) => Math.max(head[i].length, ...rows.map((r) => r[i].length)));
    const line = (r) => `${r[0].padEnd(w[0])} | ${r[1].padEnd(w[1])} | ${r[2]}`;
    console.log(line(head));
    console.log(`${'-'.repeat(w[0])}-+-${'-'.repeat(w[1])}-+-${'-'.repeat(20)}`);
    rows.forEach((r) => console.log(line(r)));

    const byCheck = {};
    fails.forEach((f) => (byCheck[f.check] = (byCheck[f.check] || 0) + 1));
    const pagesFailing = new Set(fails.map((f) => f.url)).size;
    console.log(`\nSEO check FAILED: ${fails.length} failures on ${pagesFailing}/${pageCount} pages.`);
    console.log(Object.entries(byCheck).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
}

main().then(
    (code) => process.exit(code),
    (err) => {
        console.error(`seo-check error: ${err.stack || err}`);
        process.exit(2);
    }
);
