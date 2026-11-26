import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { X509Certificate } from 'crypto';
import type { Knex } from 'knex';
import { SystemKnexConnection } from '@/modules/System/SystemDB/SystemDB.constants';
import { OrganizationSigninPolicy } from '@/modules/Auth/OrganizationSigninPolicy';
import { TenantModel } from '@/modules/System/models/TenantModel';
import {
  SamlSettingsResponseDto,
  UpdateSamlSettingsDto,
} from './SamlSettings.dto';

type SamlConfigRow = UpdateSamlSettingsDto & { tenantId: number };

function isCurrentCertificate(certificate: X509Certificate): boolean {
  const now = Date.now();
  return (
    Date.parse(certificate.validFrom) <= now &&
    now <= Date.parse(certificate.validTo)
  );
}

function validateSettings(input: UpdateSamlSettingsDto): UpdateSamlSettingsDto {
  const enabled = input.enabled;
  const idpEntityId = input.idpEntityId.trim();
  const idpSsoUrl = input.idpSsoUrl.trim();
  let idpCertificate = input.idpCertificate.trim();

  if (enabled && (!idpEntityId || !idpSsoUrl || !idpCertificate)) {
    throw new BadRequestException(
      'Enter the identity provider entity ID, sign-in URL and signing certificate before enabling SAML.',
    );
  }
  if (idpSsoUrl) {
    let url: URL;
    try {
      url = new URL(idpSsoUrl);
    } catch {
      throw new BadRequestException(
        'Enter an absolute HTTPS identity provider sign-in URL.',
      );
    }
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
      throw new BadRequestException(
        'Enter an HTTPS identity provider sign-in URL without credentials or a fragment.',
      );
    }
  }
  if (idpCertificate) {
    let certificate: X509Certificate;
    try {
      certificate = new X509Certificate(idpCertificate);
    } catch {
      throw new BadRequestException(
        'Enter the identity provider signing certificate in PEM format.',
      );
    }
    if (enabled && !isCurrentCertificate(certificate)) {
      throw new BadRequestException(
        'The identity provider signing certificate is outside its validity period.',
      );
    }
    // Store just the public certificate even if the pasted PEM contained extra material.
    idpCertificate = certificate.toString().trim();
  }
  return { enabled, idpEntityId, idpSsoUrl, idpCertificate };
}

@Injectable()
export class SamlSettingsService implements OrganizationSigninPolicy {
  constructor(
    @Inject(SystemKnexConnection)
    private readonly db: Knex,
    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
    private readonly config: ConfigService,
  ) {}

  getServiceProvider(organizationId: string) {
    const baseUrl = this.config.get<string>('app.baseUrl');
    let origin: string;
    try {
      const url = new URL(baseUrl);
      const localHttp =
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
      if (
        (url.protocol !== 'https:' && !localHttp) ||
        url.username ||
        url.password
      ) {
        throw new Error();
      }
      origin = url.origin;
    } catch {
      throw new ServiceUnavailableException(
        'Set BASE_URL to the public HTTPS application URL. Local development can use HTTP on loopback.',
      );
    }
    const prefix =
      origin + '/api/auth/saml/' + encodeURIComponent(organizationId);
    return { entityId: prefix + '/metadata', acsUrl: prefix + '/acs' };
  }

  async get(tenant: TenantModel): Promise<SamlSettingsResponseDto> {
    const row = await this.db<SamlConfigRow>('tenant_saml_configs')
      .where({ tenantId: tenant.id })
      .first();

    return {
      ...this.getServiceProvider(tenant.organizationId),
      organizationId: tenant.organizationId,
      enabled: !!row?.enabled,
      idpEntityId: row?.idpEntityId ?? '',
      idpSsoUrl: row?.idpSsoUrl ?? '',
      idpCertificate: row?.idpCertificate ?? '',
    };
  }

  async update(
    tenant: TenantModel,
    input: UpdateSamlSettingsDto,
  ): Promise<SamlSettingsResponseDto> {
    const serviceProvider = this.getServiceProvider(tenant.organizationId);
    const settings = validateSettings(input);

    await this.db<SamlConfigRow>('tenant_saml_configs')
      .insert({ tenantId: tenant.id, ...settings })
      .onConflict('tenantId')
      .merge(settings);

    return {
      organizationId: tenant.organizationId,
      ...serviceProvider,
      ...settings,
    };
  }

  async resolveTenantId(organizationId: string): Promise<number> {
    return (await this.getEnabled(organizationId)).tenantId;
  }

  async getEnabled(
    organizationId: string,
  ): Promise<SamlSettingsResponseDto & { tenantId: number }> {
    const tenant = await this.tenantModel.query().findOne({ organizationId });
    if (tenant?.isActive) {
      const settings = await this.get(tenant);
      if (
        settings.enabled &&
        isCurrentCertificate(new X509Certificate(settings.idpCertificate))
      ) {
        return { ...settings, tenantId: tenant.id };
      }
    }
    throw new UnauthorizedException(
      'SAML sign-in is unavailable for this organization.',
    );
  }
}
