import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ALL_TOKENS } from './tokens';

describe('design tokens', () => {
  const css = readFileSync(fileURLToPath(new URL('../app/globals.css', import.meta.url)), 'utf8');

  it('defines every token in the contract inside :root', () => {
    for (const token of ALL_TOKENS) {
      expect(css, `missing token ${token}`).toContain(`${token}:`);
    }
  });

  it('keeps the reduced-motion override so motion can be disabled', () => {
    expect(css).toContain('prefers-reduced-motion: reduce');
  });

  it('provides a dark theme for both system preference and explicit selection', () => {
    expect(css).toContain('prefers-color-scheme: dark');
    expect(css).toContain(":root[data-theme='dark']");
  });
});
