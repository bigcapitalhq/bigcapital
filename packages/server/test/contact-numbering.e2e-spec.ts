import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const uniquePrefix = () =>
  `T${Date.now()}-${faker.string.alphanumeric(6).toUpperCase()}-`;

const setSettings = (
  group: 'customers' | 'vendors',
  values: { autoIncrement: boolean; prefix: string; nextNumber: string },
) => {
  return request(app.getHttpServer())
    .put('/settings')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      options: [
        {
          group,
          key: 'auto_increment',
          value: values.autoIncrement,
        },
        {
          group,
          key: 'number_prefix',
          value: values.prefix,
        },
        {
          group,
          key: 'next_number',
          value: values.nextNumber,
        },
      ],
    })
    .expect(200);
};

const createCustomer = (payload: Record<string, unknown>) => {
  return request(app.getHttpServer())
    .post('/customers')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      customerType: 'business',
      currencyCode: 'USD',
      displayName: faker.commerce.productName(),
      ...payload,
    });
};

const createVendor = (payload: Record<string, unknown>) => {
  return request(app.getHttpServer())
    .post('/vendors')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      displayName: faker.commerce.productName(),
      ...payload,
    });
};

describe('Contact numbering (e2e)', () => {
  it('auto-increments customer codes', async () => {
    const prefix = uniquePrefix();

    await setSettings('customers', {
      autoIncrement: true,
      prefix,
      nextNumber: '00001',
    });

    const first = await createCustomer({}).expect(201);
    const second = await createCustomer({}).expect(201);

    expect(first.body.code).toBe(`${prefix}00001`);
    expect(second.body.code).toBe(`${prefix}00002`);
  });

  it('does not consume the customer sequence on manual override', async () => {
    const prefix = uniquePrefix();
    const manualCode = `MANUAL-${prefix}`;

    await setSettings('customers', {
      autoIncrement: true,
      prefix,
      nextNumber: '00001',
    });

    const manual = await createCustomer({ code: manualCode }).expect(201);
    const auto = await createCustomer({}).expect(201);

    expect(manual.body.code).toBe(manualCode);
    expect(auto.body.code).toBe(`${prefix}00001`);
  });

  it('leaves customer code empty when auto-increment is disabled', async () => {
    const prefix = uniquePrefix();

    await setSettings('customers', {
      autoIncrement: false,
      prefix,
      nextNumber: '00001',
    });

    const manualMode = await createCustomer({}).expect(201);
    expect(manualMode.body.code).toBeFalsy();

    await setSettings('customers', {
      autoIncrement: true,
      prefix,
      nextNumber: '00001',
    });

    const autoMode = await createCustomer({}).expect(201);
    expect(autoMode.body.code).toBe(`${prefix}00001`);
  });

  it('skips customer codes that are already used', async () => {
    const prefix = uniquePrefix();

    await setSettings('customers', {
      autoIncrement: false,
      prefix,
      nextNumber: '00001',
    });
    await createCustomer({ code: `${prefix}00001` }).expect(201);

    await setSettings('customers', {
      autoIncrement: true,
      prefix,
      nextNumber: '00001',
    });

    const auto = await createCustomer({}).expect(201);
    const nextAuto = await createCustomer({}).expect(201);

    expect(auto.body.code).toBe(`${prefix}00002`);
    expect(nextAuto.body.code).toBe(`${prefix}00003`);
  });

  it('keeps customer and vendor sequences independent', async () => {
    const customerPrefix = uniquePrefix();
    const vendorPrefix = uniquePrefix();

    await setSettings('customers', {
      autoIncrement: true,
      prefix: customerPrefix,
      nextNumber: '00001',
    });
    await setSettings('vendors', {
      autoIncrement: true,
      prefix: vendorPrefix,
      nextNumber: '00001',
    });

    const customer = await createCustomer({}).expect(201);
    const vendor = await createVendor({}).expect(201);
    const nextVendor = await createVendor({}).expect(201);

    expect(customer.body.code).toBe(`${customerPrefix}00001`);
    expect(vendor.body.code).toBe(`${vendorPrefix}00001`);
    expect(nextVendor.body.code).toBe(`${vendorPrefix}00002`);
  });

  it('rejects duplicated customer codes with a domain error', async () => {
    const code = `DUP-${uniquePrefix()}`;

    await setSettings('customers', {
      autoIncrement: false,
      prefix: uniquePrefix(),
      nextNumber: '00001',
    });

    await createCustomer({ code }).expect(201);

    const response = await createCustomer({ code }).expect(400);
    expect(response.body.errors[0].type).toBe('CUSTOMER_CODE_NOT_UNIQUE');
  });

  it('rejects duplicated vendor codes with a domain error', async () => {
    const code = `DUP-${uniquePrefix()}`;

    await setSettings('vendors', {
      autoIncrement: false,
      prefix: uniquePrefix(),
      nextNumber: '00001',
    });

    await createVendor({ code }).expect(201);

    const response = await createVendor({ code }).expect(400);
    expect(response.body.errors[0].type).toBe('VENDOR_CODE_NOT_UNIQUE');
  });
});
