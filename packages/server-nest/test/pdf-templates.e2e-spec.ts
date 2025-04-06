import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Pdf Templates (e2e)', () => {
  it('/pdf-templates (POST)', () => {
    return request(app.getHttpServer())
      .post('/pdf-templates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        template_name: 'Standard',
        resource: 'SaleInvoice',
        attributes: {},
      })
      .expect(201);
  });

  it('/pdf-templates (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/pdf-templates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({
        template_name: 'Standard',
        resource: 'SaleInvoice',
        attributes: {},
      });
    const pdfTemplateId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/pdf-templates/${pdfTemplateId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/pdf-templates/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/pdf-templates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({
        template_name: 'Standard',
        resource: 'SaleInvoice',
        attributes: {},
      });
    const pdfTemplateId = response.body.id;

    return request(app.getHttpServer())
      .get(`/pdf-templates/${pdfTemplateId}`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/pdf-templates/:id/assign-default (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/pdf-templates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({
        template_name: 'Standard',
        resource: 'SaleInvoice',
        attributes: {},
      });
    const pdfTemplateId = response.body.id;

    return request(app.getHttpServer())
      .put(`/pdf-templates/${pdfTemplateId}/assign-default`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });
});
