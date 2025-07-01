import { Inject, Injectable } from '@nestjs/common';
import { ApiKeyModel } from '../models/ApiKey.model';
import { ClsService } from 'nestjs-cls';
import { TenantModel } from '@/modules/System/models/TenantModel';

@Injectable()
export class AuthApiKeyAuthorizeService {
  constructor(
    private readonly clsService: ClsService,

    @Inject(ApiKeyModel.name)
    private readonly apikeyModel: typeof ApiKeyModel,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) {}

  /**
   * Authenticate using the given api key.
   */
  async authorize(apiKey: string): Promise<boolean> {
    const apiKeyRecord = await this.apikeyModel
      .query()
      .findOne({ key: apiKey });

    if (!apiKeyRecord) {
      return false;
    }
    if (apiKeyRecord.revoked) {
      return false;
    }
    if (
      apiKeyRecord.expiresAt &&
      new Date(apiKeyRecord.expiresAt) < new Date()
    ) {
      return false;
    }
    const tenant = await this.tenantModel
      .query()
      .findById(apiKeyRecord.tenantId);

    if (!tenant) return false;

    this.clsService.set('tenantId', tenant.id);
    this.clsService.set('organizationId', tenant.organizationId);
    this.clsService.set('userId', apiKeyRecord.userId);

    return true;
  }
}
