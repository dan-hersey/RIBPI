/**
 * RIBPI bill-status watcher.
 *
 * Run nightly by .github/workflows/bill-status-watch.yml (or locally with
 * `node scripts/check-bill-status.mjs`). For every bill in js/bills-data.js:
 *
 *   1. Hashes each `watchUrls` document (bill text PDFs on
 *      webserver.rilegislature.gov). A changed hash means the posted text
 *      changed — e.g. an amended or substitute version replaced it.
 *   2. Probes for NEW substitute versions (S2021.pdf -> S2021A.pdf, ...A.pdf
 *      -> ...B.pdf). A substitute appearing is a strong signal the bill moved.
 *
 * Results are compared against scripts/bill-status-cache.json. Detected
 * changes are printed and written to bill-status-changes.md so the workflow
 * can open a GitHub issue reminding you to verify the status at
 * status.rilegislature.gov and update js/bills-data.js.
 *
 * This intentionally does NOT scrape the legislature's status application —
 * it is a JS-rendered app that breaks scrapers. Document hashes are dumb
 * but dependable.
 */

import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { RIBPI_BILLS } = require(join(__dirname, '..', 'js', 'bills-data.js'));

const CACHE_PATH = join(__dirname, 'bill-status-cache.json');
const CHANGES_PATH = join(__dirname, '..', 'bill-status-changes.md');
const UA = 'RIBPI-bill-watcher (https://ribpi.com; dan@ribpi.com)';

function nextSubstituteUrl(url) {
  // .../S2021.pdf -> .../S2021A.pdf ; .../S2198A.pdf -> .../S2198B.pdf
  const m = url.match(/^(.*\/[HS]\d+)([A-Z]?)\.pdf$/i);
  if (!m) return null;
  const next = m[2] ? String.fromCharCode(m[2].charCodeAt(0) + 1) : 'A';
  return `${m[1]}${next}.pdf`;
}

async function fetchHash(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return { status: res.status, hash: null };
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, hash: createHash('sha256').update(buf).digest('hex') };
}

async function exists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA } });
    return res.ok;
  } catch {
    return false;
  }
}

const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf8')) : {};
const newCache = {};
const changes = [];

for (const bill of RIBPI_BILLS) {
  for (const url of bill.watchUrls || []) {
    // 1. Document content change
    let result;
    try {
      result = await fetchHash(url);
    } catch (err) {
      console.error(`fetch failed for ${url}: ${err.message}`);
      newCache[url] = cache[url]; // keep old entry, don't false-alarm
      continue;
    }
    newCache[url] = result.hash ?? cache[url];
    if (cache[url] && result.hash && cache[url] !== result.hash) {
      changes.push(`- **${bill.numbers}** (${bill.title}): posted bill text changed — ${url}`);
    }

    // 2. New substitute version appeared
    const subUrl = nextSubstituteUrl(url);
    if (subUrl && !(subUrl in cache) && !(subUrl in newCache)) {
      if (await exists(subUrl)) {
        newCache[subUrl] = 'seen';
        changes.push(`- **${bill.numbers}** (${bill.title}): new substitute version posted — ${subUrl}`);
      }
    } else if (subUrl && cache[subUrl]) {
      newCache[subUrl] = cache[subUrl];
    }
  }
}

writeFileSync(CACHE_PATH, JSON.stringify(newCache, null, 2) + '\n');

if (changes.length) {
  const body = [
    'The nightly watcher detected changes on the RI legislature web server.',
    '',
    ...changes,
    '',
    'Verify the current status at https://status.rilegislature.gov and update `js/bills-data.js` (statuses, ticker text, stepper states, and `lastUpdated`).'
  ].join('\n');
  writeFileSync(CHANGES_PATH, body + '\n');
  console.log('CHANGES DETECTED:\n' + body);
  process.exitCode = 0;
} else {
  console.log('No changes detected.');
}
