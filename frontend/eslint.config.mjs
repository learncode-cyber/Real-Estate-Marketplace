import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** Native flat config for Next.js 16 (no legacy FlatCompat bridge). */
const config = [
  { ignores: ['.next/**', 'out/**', 'coverage/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
