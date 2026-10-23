// Enforces the owner's Advertising Platform restriction (PLANNING.md section 15, Phase 12).
// Fails if advertising code, routes, tables, or folders appear in the implementation tree.
// Planning documents (PLANNING.md and docs/) are intentionally excluded.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
// scripts/ holds these guards and necessarily names the forbidden terms, so it is excluded.
const SKIP = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'generated',
  'coverage',
  'docs',
  'scripts',
]);
const FORBIDDEN_PATH =
  /(^|[/._-])(ads?|advertising|ad-?engine|campaigns?|creatives?|auctions?|ad-?sets?|sponsored)([/._-]|$)/i;
const FORBIDDEN_IDENTIFIERS =
  /\b(campaignId|adCreative|AdCampaign|ad_campaign|auctionEngine|budgetPacing)\b/;
const CODE_EXT = /\.(ts|tsx|js|mjs|cjs|jsx|prisma|sql|json|css)$/i;

const violations = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    const rel = relative(root, full);
    if (FORBIDDEN_PATH.test(rel)) violations.push(rel);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (CODE_EXT.test(name) && FORBIDDEN_IDENTIFIERS.test(readFileSync(full, 'utf8'))) {
      violations.push(`${rel} (advertising identifier found)`);
    }
  }
}

walk(root);
if (violations.length > 0) {
  console.error('Advertising-scope check FAILED. Remove until the owner authorizes Phase 12:');
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log('Advertising-scope check passed: no advertising code, routes, tables, or folders.');
