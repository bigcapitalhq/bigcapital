import { getApiKeyPrefix, hashApiKey } from './Auth.utils';

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
});
