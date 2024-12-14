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
});
