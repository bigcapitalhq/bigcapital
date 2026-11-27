import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SamlProtocolService } from './SamlProtocol.service';

describe('SP-initiated organization SAML sign-in', () => {
  const readFixture = (file: string) =>
    readFileSync(join(__dirname, '__fixtures__', file));
  const certificate = readFixture('test-idp.pem').toString();
  const response = readFixture('test-response.xml').toString('base64');
  const prefix = 'https://bigcapital.example/api/auth/saml/org-1';
  const config = {
    organizationId: 'org-1',
    tenantId: 1,
    entityId: prefix + '/metadata',
    acsUrl: prefix + '/acs',
    idpEntityId: 'https://idp.example/metadata',
    idpCertificate: certificate,
    idpSsoUrl: 'https://idp.example/sso',
    enabled: true,
  };
  const getEnabled = jest.fn();
  let protocol: SamlProtocolService;

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
    jest.setSystemTime(new Date('2026-12-01T12:00:00.000Z'));
    const keys = new Map<string, string>();
    const redis = {
      get: async (key: string) => keys.get(key) || null,
      getdel: async (key: string) => {
        const value = keys.get(key);
        keys.delete(key);
        return value || null;
      },
      set: async (
        key: string,
        value: string,
        _px: string,
        _ttl: number,
        nx?: string,
      ) => {
        if (nx && keys.has(key)) return null;
        keys.set(key, value);
        return 'OK';
      },
    };
    getEnabled.mockReset().mockResolvedValue(config);
    protocol = new SamlProtocolService(
      { getEnabled, getServiceProvider: () => config } as any,
      { getOrThrow: () => redis } as any,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  async function start() {
    // The public signed fixture answers a request with this deterministic ID.
    const bytes = jest
      .spyOn(crypto, 'randomBytes')
      .mockImplementationOnce(() => Buffer.alloc(32, 2))
      .mockImplementationOnce(() => Buffer.alloc(20, 1));
    const { browserSecret, redirectUrl } = await protocol.start('org-1');
    bytes.mockRestore();
    const idp = new URL(redirectUrl);
    expect(idp.origin + idp.pathname).toBe(config.idpSsoUrl);
    return { browserSecret, relay: idp.searchParams.get('RelayState') };
  }

  it('accepts the signed assertion once and redeems it only in the initiating browser', async () => {
    const { browserSecret, relay } = await start();
    const callbacks = await Promise.allSettled([
      protocol.accept('org-1', relay, response),
      protocol.accept('org-1', relay, response),
    ]);
    const accepted = callbacks.filter(
      (x) => x.status === 'fulfilled',
    ) as PromiseFulfilledResult<string>[];
    expect(accepted).toHaveLength(1);
    const code = accepted[0].value;
    await expect(protocol.redeem('00'.repeat(32), code)).rejects.toThrow();
    await expect(protocol.redeem(browserSecret, code)).resolves.toEqual({
      organizationId: 'org-1',
      email: 'member@example.com',
    });
    await expect(protocol.redeem(browserSecret, code)).rejects.toThrow();
  });

  it('requires a live request under the same organization and RelayState', async () => {
    const { relay } = await start();
    await expect(
      protocol.accept('org-1', 'ff'.repeat(32), response),
    ).rejects.toThrow();
    getEnabled.mockResolvedValue({
      ...config,
      organizationId: 'org-2',
      tenantId: 2,
    });
    await expect(protocol.accept('org-2', relay, response)).rejects.toThrow();
  });

  it.each([
    ['audience', { entityId: 'https://sp.example/another-entity' }],
    ['issuer', { idpEntityId: 'urn:some-other-provider' }],
    ['recipient', { acsUrl: 'https://sp.example/another-acs' }],
  ])('requires the expected signed %s', async (_name, overrides) => {
    getEnabled.mockResolvedValue({
      ...config,
      ...(overrides as Partial<typeof config>),
    });
    const { relay } = await start();
    await expect(protocol.accept('org-1', relay, response)).rejects.toThrow();
  });

  it('rejects an expired assertion', async () => {
    const { relay } = await start();
    jest.setSystemTime(new Date('2026-12-01T12:07:00Z'));
    await expect(protocol.accept('org-1', relay, response)).rejects.toThrow();
  });

  it('rejects an exchange after the organization changes trust settings', async () => {
    const { browserSecret, relay } = await start();
    const code = await protocol.accept('org-1', relay, response);
    getEnabled.mockResolvedValue({
      ...config,
      idpEntityId: 'https://new-idp.example',
    });
    await expect(protocol.redeem(browserSecret, code)).rejects.toThrow();
  });

  it('publishes provider metadata before enablement', () => {
    expect(protocol.metadata('org-1')).toContain(config.acsUrl);
    expect(protocol.metadata('org-1')).toContain(config.entityId);
    expect(getEnabled).not.toHaveBeenCalled();
  });
});
