import { describe, expect, it } from '@jest/globals';
import { loadConfig } from '../src/config/env';

describe('loadConfig', () => {
  it('applies safe defaults when optional variables are absent', () => {
    const config = loadConfig({});
    expect(config.port).toBe(4000);
    expect(config.nodeEnv).toBe('development');
    expect(config.corsOrigins).toEqual(['http://localhost:3000']);
    expect(config.databaseUrl).toBeUndefined();
  });

  it('accepts a PostgreSQL connection string', () => {
    const config = loadConfig({ DATABASE_URL: 'postgresql://app:secret@db.example.invalid/x' });
    expect(config.databaseUrl).toBe('postgresql://app:secret@db.example.invalid/x');
  });

  it('rejects a non-PostgreSQL DATABASE_URL without echoing the value', () => {
    expect(() => loadConfig({ DATABASE_URL: 'mysql://app:hunter2@host/db' })).toThrow(
      /DATABASE_URL: must be a postgresql/,
    );
    try {
      loadConfig({ DATABASE_URL: 'mysql://app:hunter2@host/db' });
    } catch (error) {
      expect(String(error)).not.toContain('hunter2');
    }
  });

  it('rejects wildcard CORS origins', () => {
    expect(() => loadConfig({ CORS_ORIGINS: 'https://a.example, *' })).toThrow(
      /wildcard origins are not allowed/,
    );
  });

  it('parses a comma-separated CORS allowlist', () => {
    const config = loadConfig({ CORS_ORIGINS: 'https://a.example, https://b.example' });
    expect(config.corsOrigins).toEqual(['https://a.example', 'https://b.example']);
  });
});
