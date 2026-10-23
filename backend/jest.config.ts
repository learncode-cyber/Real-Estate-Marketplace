import type { Config } from 'jest';

/**
 * @nestjs/testing ships as an ES module ("type": "module"), while this backend compiles to
 * CommonJS. Only that package is transformed; everything else in node_modules is left as is.
 */
const config: Config = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '(test/.*|\\.spec)\\.ts$',
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          target: 'ES2022',
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          allowJs: true,
        },
        diagnostics: true,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!@nestjs/testing/)'],
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
};

export default config;
