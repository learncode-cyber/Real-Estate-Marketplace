import { describe, expect, it } from 'vitest';
import { parsePublicEnv } from './public-env';

describe('parsePublicEnv', () => {
  it('defaults the API base URL to local development', () => {
    expect(parsePublicEnv({}).NEXT_PUBLIC_API_BASE_URL).toBe('http://localhost:4000/api/v1');
  });

  it('accepts an https API base URL', () => {
    expect(
      parsePublicEnv({ NEXT_PUBLIC_API_BASE_URL: 'https://api.example.invalid/api/v1' })
        .NEXT_PUBLIC_API_BASE_URL,
    ).toBe('https://api.example.invalid/api/v1');
  });

  it('rejects plain http for non-localhost hosts', () => {
    expect(() =>
      parsePublicEnv({ NEXT_PUBLIC_API_BASE_URL: 'http://api.example.invalid/api/v1' }),
    ).toThrow(/must be https/);
  });
});
