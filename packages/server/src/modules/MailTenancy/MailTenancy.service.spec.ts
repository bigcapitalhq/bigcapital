import { MailTenancy } from './MailTenancy.service';

describe('MailTenancy', () => {
  const tenancyContext = {
    getTenantMetadata: jest.fn().mockResolvedValue({ name: 'Acme Inc.' }),
  };

  it('should return the sender address as a string when config from is an object', async () => {
    const config = {
      get: jest.fn().mockReturnValue({
        name: 'Acme Inc.',
        address: 'no-reply@acme.com',
      }),
    };
    const service = new MailTenancy(tenancyContext as any, config as any);

    await expect(service.senders()).resolves.toEqual([
      { mail: 'no-reply@acme.com', label: 'Acme Inc.', primary: true },
    ]);
  });

  it('should keep supporting a plain string config from', async () => {
    const config = { get: jest.fn().mockReturnValue('no-reply@acme.com') };
    const service = new MailTenancy(tenancyContext as any, config as any);

    await expect(service.senders()).resolves.toEqual([
      { mail: 'no-reply@acme.com', label: 'Acme Inc.', primary: true },
    ]);
  });

  it('should filter out empty sender addresses', async () => {
    const config = { get: jest.fn().mockReturnValue({ name: 'Acme Inc.' }) };
    const service = new MailTenancy(tenancyContext as any, config as any);

    await expect(service.senders()).resolves.toEqual([]);
  });
});
