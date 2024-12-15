import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule } from '../src/modules/App/App.module';
import { app } from './init-app-test';

describe('Items (e2e)', () => {
  it('/items (POST)', () => {
    return request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send({
        name: faker.commerce.productName(),
        type: 'service',
      })
      .expect(201);
  });

  it('/items/:id (POST)', async () => {
    const item = {
      name: faker.commerce.productName(),
      type: 'service',
    };
    return request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send({
        name: faker.commerce.productName(),
        type: 'service',
      })
      .expect(201);
  });

  it('/items/:id/inactivate (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send({
        name: faker.commerce.productName(),
        type: 'service',
      });
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/items/${itemId}/inactivate`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/items/:id/activate (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send({
        name: faker.commerce.productName(),
        type: 'service',
      });
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/items/${itemId}/activate`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
