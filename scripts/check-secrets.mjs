// Lightweight secret scan for the repository. It blocks real-looking connection strings,
// private keys, and secret-named variables exposed through NEXT_PUBLIC_*. It is a guard
// rail, not a replacement for a dedicated scanner in CI.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const SKIP = new Set(['node_modules', '.git', '.next', 'dist', 'generated', 'coverage']);
// Local developer secrets. .env is git-ignored and must never be committed; the scanner
// guards committed files (for example .env.example), so this file is skipped by name.
const LOCAL_SECRET_FILES = new Set(['.env']);
const CHECKS = [
  {
    name: 'database connection string with inline credentials',
    re: /postgres(ql)?:\/\/[^\s:/@'"`]+:[^\s@'"`]+@/i,
    allow: /USER:PASSWORD|user:password|example\.invalid/,
  },
  { name: 'private key block', re: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
  {
    name: 'secret-named variable exposed to the browser',
    re: /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|PASSWORD|TOKEN|DATABASE_URL|PRIVATE)[A-Z0-9_]*/,
  },
];
const findings = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (basename(full) === 'package-lock.json' || LOCAL_SECRET_FILES.has(basename(full))) continue;
    const text = readFileSync(full, 'utf8');
    if (text.includes('\0')) continue;
    for (const check of CHECKS) {
      for (const line of text.split('\n')) {
        if (check.re.test(line) && !(check.allow && check.allow.test(line))) {
          findings.push(`${relative(root, full)}: ${check.name}`);
          break;
        }
      }
    }
  }
}
walk(root);
if (findings.length) {
  console.error('Secret scan FAILED:');
  for (const f of findings) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  'Secret scan passed: no inline credentials, private keys, or exposed secret variables.',
);
