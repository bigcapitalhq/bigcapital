import {
  BadRequestException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { X509Certificate } from 'crypto';
import type { Knex } from 'knex';
import { rootCertificates } from 'tls';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SamlSettingsService } from './SamlSettings.service';

const tenant = {
  id: 1,
  organizationId: 'org-a',
  isActive: true,
} as TenantModel;
const otherTenant = {
  id: 2,
  organizationId: 'org-b',
  isActive: true,
} as TenantModel;
const certificate = new X509Certificate(rootCertificates[0]);
const settings = {
  enabled: true,
  idpEntityId: 'urn:idp:a',
  idpSsoUrl: 'https://idp.example/saml',
  idpCertificate: certificate.toString().trim(),
};

describe('organization SAML settings', () => {
  const db = jest.fn();
  const findOne = jest.fn();
  const config = new ConfigService({
    app: { baseUrl: 'https://accounting.example' },
  });
  const service = new SamlSettingsService(
    db as unknown as Knex,
    { query: () => ({ findOne }) } as unknown as typeof TenantModel,
    config,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date(certificate.validFrom));
  });

  afterEach(() => jest.useRealTimers());

  it('saves only the authenticated organization ID with an atomic upsert', async () => {
    const merge = jest.fn();
    const onConflict = jest.fn().mockReturnValue({ merge });
    const insert = jest.fn().mockReturnValue({ onConflict });
    db.mockReturnValue({ insert });

    const input = {
      ...settings,
      tenantId: otherTenant.id,
      organizationId: otherTenant.organizationId,
    };
    const saved = await service.update(tenant, input);
    expect(insert).toHaveBeenCalledWith({
      tenantId: tenant.id,
      ...settings,
    });
    expect(onConflict).toHaveBeenCalledWith('tenantId');
    expect(saved.organizationId).toBe(tenant.organizationId);
  });

  it('uses only the requested active organization for public sign-in', async () => {
    const where = jest.fn(({ tenantId }) => ({
      first: () =>
        Promise.resolve(tenantId === tenant.id ? settings : undefined),
    }));
    db.mockReturnValue({ where });
    findOne.mockImplementation(({ organizationId }) =>
      [tenant, otherTenant].find(
        (organization) => organization.organizationId === organizationId,
      ),
    );

    expect(await service.getEnabled(tenant.organizationId)).toMatchObject({
      organizationId: tenant.organizationId,
      tenantId: tenant.id,
      acsUrl: 'https://accounting.example/api/auth/saml/org-a/acs',
      entityId: 'https://accounting.example/api/auth/saml/org-a/metadata',
    });
    await expect(
      service.getEnabled(otherTenant.organizationId),
    ).rejects.toThrow(UnauthorizedException);
    await expect(service.getEnabled('missing')).rejects.toThrow(
      UnauthorizedException,
    );
    findOne.mockResolvedValue({ ...tenant, isActive: false });
    await expect(service.getEnabled(tenant.organizationId)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(where).toHaveBeenCalledTimes(2);
  });

  it('allows local HTTP development and requires HTTPS on public deployments', () => {
    const getUrl = jest
      .spyOn(config, 'get')
      .mockReturnValue('http://localhost:4000');
    try {
      expect(service.getServiceProvider('org-a').acsUrl).toBe(
        'http://localhost:4000/api/auth/saml/org-a/acs',
      );
      getUrl.mockReturnValue('http://example.com');
      expect(() => service.getServiceProvider('org-a')).toThrow(
        ServiceUnavailableException,
      );
    } finally {
      getUrl.mockRestore();
    }
  });

  it('prevents sign-in after the pinned certificate expires', async () => {
    jest.setSystemTime(Date.parse(certificate.validTo) + 1000);
    findOne.mockResolvedValue(tenant);
    db.mockReturnValue({ where: () => ({ first: () => settings }) });
    await expect(service.getEnabled(tenant.organizationId)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it.each([
    { idpEntityId: ' ' },
    { idpSsoUrl: 'http://idp.example/saml' },
    { idpSsoUrl: 'https://user@idp.example/saml' },
    { idpCertificate: 'invalid' },
  ])('rejects invalid configuration before writing', async (value) => {
    await expect(
      service.update(tenant, { ...settings, ...value }),
    ).rejects.toThrow(BadRequestException);
    expect(db).not.toHaveBeenCalled();
  });
});
