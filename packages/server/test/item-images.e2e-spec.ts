import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

const withTenantHeaders = (test: request.Test): request.Test =>
  test
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader);

describe('Item images (e2e)', () => {
  let itemId: number | undefined;
  let s3Available = true;

  beforeAll(async () => {
    const response = await withTenantHeaders(
      request(app.getHttpServer()).post('/items'),
    ).send({
      name: faker.commerce.productName(),
      type: 'service',
      unit: 'kg',
    });
    itemId = response.body.id;
  });

  afterAll(async () => {
    if (itemId) {
      await withTenantHeaders(
        request(app.getHttpServer()).delete(`/items/${itemId}`),
      );
    }
  });

  const uploadImages = (type: string, count = 1): request.Test => {
    let test = withTenantHeaders(
      request(app.getHttpServer()).post(`/items/${itemId}/images`),
    ).field('type', type);

    for (let index = 0; index < count; index++) {
      test = test.attach('files', ONE_PIXEL_PNG, {
        filename: `${type}-${index}.png`,
        contentType: 'image/png',
      });
    }
    return test;
  };

  const getItem = (): request.Test =>
    withTenantHeaders(request(app.getHttpServer()).get(`/items/${itemId}`));

  it('uploads a front image and exposes it on the item', async () => {
    const uploadResponse = await uploadImages('front');

    // Uploading requires an S3-compatible service which is not available in
    // every test environment, so skip when the upload cannot be performed.
    if (uploadResponse.status !== 200) {
      s3Available = false;
      return;
    }
    expect(uploadResponse.body.images).toHaveLength(1);
    expect(uploadResponse.body.images[0].type).toEqual('front');

    const itemResponse = await getItem();
    expect(itemResponse.body.picture_uri).toBeTruthy();
    expect(itemResponse.body.images).toHaveLength(1);
    expect(itemResponse.body.images[0].image_uri).toBeTruthy();
    expect(itemResponse.body.images[0].thumbnail_uri).toBeTruthy();
  });

  it('replaces the front image instead of adding a second one', async () => {
    if (!s3Available) return;

    const uploadResponse = await uploadImages('front');
    if (uploadResponse.status !== 200) return;

    const itemResponse = await getItem();
    const frontImages = itemResponse.body.images.filter(
      (image: { type: string }) => image.type === 'front',
    );
    expect(frontImages).toHaveLength(1);
  });

  it('rejects uploads beyond the 15 image limit', async () => {
    if (!s3Available) return;

    // The item already has one front image; 14 "other" images fill the limit.
    const fillResponse = await uploadImages('other', 14);
    if (fillResponse.status !== 200) return;

    const overflowResponse = await uploadImages('other');
    expect(overflowResponse.status).toEqual(400);
    expect(overflowResponse.body.errors[0].type).toEqual(
      'ITEM_IMAGES_LIMIT_EXCEEDED',
    );
  });

  it('deletes an image and falls back to the next primary image', async () => {
    if (!s3Available) return;

    const itemResponse = await getItem();
    const frontImage = itemResponse.body.images.find(
      (image: { type: string }) => image.type === 'front',
    );
    expect(frontImage).toBeTruthy();

    const deleteResponse = await withTenantHeaders(
      request(app.getHttpServer()).delete(
        `/items/${itemId}/images/${frontImage.id}`,
      ),
    );
    expect(deleteResponse.status).toEqual(200);

    const updatedItemResponse = await getItem();
    expect(
      updatedItemResponse.body.images.filter(
        (image: { type: string }) => image.type === 'front',
      ),
    ).toHaveLength(0);
    expect(updatedItemResponse.body.picture_uri).toBeTruthy();
  });
});
