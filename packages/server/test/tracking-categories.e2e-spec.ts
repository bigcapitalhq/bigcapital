import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const uniqueName = (prefix: string) =>
  `${prefix} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`;

const createTrackingCategory = async (payload?: Record<string, any>) => {
  const response = await request(app.getHttpServer())
    .post('/tracking-categories')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      name: uniqueName('Location'),
      options: [{ name: 'North Store' }, { name: 'South Store' }],
      ...payload,
    })
    .expect(201);

  return response.body;
};

describe('Tracking Categories (e2e)', () => {
  it('/tracking-categories (POST) creates a category with options', async () => {
    const category = await createTrackingCategory();

    expect(category.name).toContain('Location');
    expect(category.active).toBe(true);
    expect(category.options).toHaveLength(2);
    expect(category.options[0].active).toBe(true);
    expect(category.options[0].category_id).toBe(category.id);
  });

  it('/tracking-categories (GET) returns categories with options', async () => {
    const created = await createTrackingCategory();
    const response = await request(app.getHttpServer())
      .get('/tracking-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const foundCategory = response.body.find(
      (item: { id: number }) => item.id === created.id,
    );

    expect(foundCategory).toBeDefined();
    expect(foundCategory.options).toHaveLength(2);
  });

  it('/tracking-categories/:id (GET) returns the category details', async () => {
    const created = await createTrackingCategory();
    const response = await request(app.getHttpServer())
      .get(`/tracking-categories/${created.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.id).toBe(created.id);
    expect(response.body.options).toHaveLength(2);
  });

  it('/tracking-categories/:id (PUT) edits, archives, and restores', async () => {
    const created = await createTrackingCategory();
    const firstOptionId = created.options[0].id;

    const edited = await request(app.getHttpServer())
      .put(`/tracking-categories/${created.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: uniqueName('Region'),
        options: [
          { id: firstOptionId, name: 'North Store', active: false },
          { name: 'East Store' },
        ],
      })
      .expect(200);

    expect(edited.body.name).toContain('Region');
    expect(edited.body.options).toHaveLength(2);
    expect(
      edited.body.options.find(
        (option: { id: number }) => option.id === firstOptionId,
      ).active,
    ).toBe(false);

    const archived = await request(app.getHttpServer())
      .put(`/tracking-categories/${created.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: false })
      .expect(200);

    expect(archived.body.active).toBe(false);

    const restored = await request(app.getHttpServer())
      .put(`/tracking-categories/${created.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: true })
      .expect(200);

    expect(restored.body.active).toBe(true);
  });

  it('/tracking-categories/:id (DELETE) deletes an unused category', async () => {
    const created = await createTrackingCategory();

    await request(app.getHttpServer())
      .delete(`/tracking-categories/${created.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/tracking-categories/${created.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(404);

    expect(response.body.message).toBeDefined();
  });

  it('rejects duplicate category names', async () => {
    const name = uniqueName('Department');
    await createTrackingCategory({ name });

    const response = await request(app.getHttpServer())
      .post('/tracking-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ name, options: [{ name: 'Sales' }] })
      .expect(400);

    expect(response.body.errors[0].type).toBe('TRACKING_CATEGORY_NAME_EXISTS');
  });

  it('rejects duplicate option names within a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/tracking-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: uniqueName('Channel'),
        options: [{ name: 'Sales' }, { name: 'sales' }],
      })
      .expect(400);

    expect(response.body.errors[0].type).toBe(
      'TRACKING_CATEGORY_OPTION_NAME_EXISTS',
    );
  });
});
