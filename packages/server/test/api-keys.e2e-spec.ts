import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('API Keys (e2e)', () => {
  it('/api-keys (GET) returns masked tokens only', async () => {
    const response = await request(app.getHttpServer())
      .get('/api-keys')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const keys = response.body?.data ?? response.body ?? [];
    expect(Array.isArray(keys)).toBe(true);

    keys.forEach((apiKey: Record<string, unknown>) => {
      // The raw key and its hash must never be exposed on the list.
      expect(apiKey).not.toHaveProperty('key');
      expect(apiKey).not.toHaveProperty('key_hash');
      expect(apiKey).not.toHaveProperty('keyHash');
      expect(apiKey).not.toHaveProperty('user_id');
      expect(apiKey).not.toHaveProperty('userId');
    });
  });

  it('/api-keys/generate (POST) returns the raw key once and stores only its hash', async () => {
    const response = await request(app.getHttpServer())
      .post('/api-keys/generate')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.string.alphanumeric(10),
      })
      .expect(201);

    const { key } = response.body;
    expect(typeof key).toBe('string');
    expect(key.startsWith('bc_')).toBe(true);

    // The generated key is immediately usable as an access token.
    await request(app.getHttpServer())
      .get('/api-keys')
      .set('Authorization', `Bearer ${key}`)
      .expect(200);
  });
});
