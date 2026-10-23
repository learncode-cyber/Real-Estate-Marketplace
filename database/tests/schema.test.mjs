// Offline schema guard. Full validation runs through `prisma validate` in the typecheck script.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync(new URL('../prisma/schema.prisma', import.meta.url), 'utf8');

test('datasource is PostgreSQL and holds no inline credentials', () => {
  assert.match(schema, /provider = "postgresql"/);
  assert.doesNotMatch(schema, /url\s*=/);
});

test('market model uses UUID keys, UTC timestamps, and integer minor-unit currency metadata', () => {
  assert.match(schema, /model Market \{[\s\S]*id\s+String\s+@id @default\(uuid\(\)\) @db\.Uuid/);
  assert.match(schema, /createdAt\s+DateTime\s+@default\(now\(\)\) @db\.Timestamptz\(3\)/);
  assert.match(schema, /currencyMinorUnits Int/);
});

test('no advertising models exist in the schema', () => {
  assert.doesNotMatch(schema, /model\s+\w*(Ad|Campaign|Creative|Auction|Sponsor)\w*/i);
});
