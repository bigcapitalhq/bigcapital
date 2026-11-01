import { GetApiKeysTransformer } from './GetApiKeys.transformer';

const buildApiKey = (overrides: any = {}) =>
  ({
    id: 1,
    name: 'My API Key',
    keyHash: 'a'.repeat(64),
    keyPrefix: 'bc_12345',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    expiresAt: null,
    revokedAt: null,
    tenantId: 10,
    userId: 20,
    revoked: false,
    ...overrides,
  }) as any;

describe('GetApiKeysTransformer', () => {
  it('exposes only the whitelisted attributes', () => {
    const transformer = new GetApiKeysTransformer();
    const dto = transformer.work(buildApiKey());

    expect(Object.keys(dto).sort()).toEqual(
      ['createdAt', 'expiresAt', 'id', 'name', 'revoked', 'token'].sort(),
    );
    expect(dto.keyHash).toBeUndefined();
    expect(dto.keyPrefix).toBeUndefined();
    expect(dto.tenantId).toBeUndefined();
    expect(dto.userId).toBeUndefined();
  });

  it('masks the API key prefix', () => {
    const transformer = new GetApiKeysTransformer();
    const dto = transformer.work(buildApiKey());

    expect(dto.token).toBe('bc_12345...');
  });

  it('returns an empty token when the prefix is missing', () => {
    const transformer = new GetApiKeysTransformer();
    const dto = transformer.work(buildApiKey({ keyPrefix: undefined }));

    expect(dto.token).toBe('');
  });

  it('keeps the expiration date and the revoked flag', () => {
    const expiresAt = new Date('2024-12-31T23:59:59.000Z');
    const transformer = new GetApiKeysTransformer();
    const dto = transformer.work(
      buildApiKey({ expiresAt, revokedAt: new Date(), revoked: true }),
    );

    expect(dto.expiresAt).toBe(expiresAt);
    expect(dto.revoked).toBe(true);
  });
});
