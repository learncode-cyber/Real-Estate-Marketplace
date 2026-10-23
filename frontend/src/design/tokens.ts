/**
 * Design-token contract. The CSS custom properties in src/app/globals.css must define every
 * name listed here. tests/tokens.test.ts enforces this so tokens cannot silently drift.
 */
export const COLOR_TOKENS = [
  '--color-background',
  '--color-surface',
  '--color-foreground',
  '--color-muted',
  '--color-border',
  '--color-accent',
  '--color-accent-foreground',
  '--color-focus',
  '--color-danger',
  '--color-success',
] as const;

export const LAYOUT_TOKENS = [
  '--font-sans',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--space-unit',
  '--shadow-card',
  '--motion-duration-fast',
  '--motion-duration-base',
] as const;

export const ALL_TOKENS = [...COLOR_TOKENS, ...LAYOUT_TOKENS] as const;
export type TokenName = (typeof ALL_TOKENS)[number];
