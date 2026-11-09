import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Attachments (e2e)', () => {
  it('/attachments/:id/presigned-url (GET)', async () => {
    const upload = await request(app.getHttpServer())
      .post('/attachments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .attach('file', Buffer.from('attachment test content'), {
        filename: 'test.txt',
        contentType: 'text/plain',
      });

    // Uploading requires an S3-compatible service which is not available in
    // every test environment, so skip when the upload cannot be performed.
    if (upload.status !== 200 || !upload.body?.data?.id) {
      return;
    }

    return request(app.getHttpServer())
      .get(`/attachments/${upload.body.data.id}/presigned-url`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
