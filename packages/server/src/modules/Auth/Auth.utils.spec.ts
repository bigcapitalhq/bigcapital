import { buildUrlWithQuery, getApiKeyPrefix, hashApiKey } from './Auth.utils';

describe('Auth.utils', () => {
  describe('hashApiKey', () => {
    it('returns the SHA-256 hex digest of the API key', () => {
      // The digest is asserted to keep the runtime hash compatible with the
      // `SHA2(key, 256)` backfill used by the system migration.
      expect(hashApiKey('bc_0123456789abcdef')).toBe(
        '547d761a8c94e73c15f51587b77088806d35b4564e254f8be8b185e2ff31c993',
      );
    });
  });

  describe('getApiKeyPrefix', () => {
    it('returns the first 8 characters of the API key', () => {
      expect(getApiKeyPrefix('bc_0123456789abcdef')).toBe('bc_01234');
    });
  });

  describe('buildUrlWithQuery', () => {
    it('appends query params to an absolute URL', () => {
      expect(
        buildUrlWithQuery('https://app.example.com/auth/callback', {
          token: 'abc',
          user_id: 10,
        }),
      ).toBe('https://app.example.com/auth/callback?token=abc&user_id=10');
    });

    it('keeps relative URLs relative and skips empty values', () => {
      expect(
        buildUrlWithQuery('/auth/login', {
          error: 'google_auth_failed',
          empty: '',
          missing: undefined,
        }),
      ).toBe('/auth/login?error=google_auth_failed');
    });
  });
});
