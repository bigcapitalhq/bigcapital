import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ApiKeyModel } from '../models/ApiKey.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class GenerateApiKey {
  constructor(
    private readonly tenancyContext: TenancyContext,
    @Inject(ApiKeyModel.name)
    private readonly apiKeyModel: typeof ApiKeyModel,
  ) {}

  /**
   *
   * @returns
   */
  async generate() {
    const tenant = await this.tenancyContext.getTenant();
    const user = await this.tenancyContext.getSystemUser();

    // Generate a secure random API key
    const key = crypto.randomBytes(48).toString('hex');
    // Save the API key to the database
    const apiKeyRecord = await this.apiKeyModel.query().insert({
      key,
      tenantId: tenant.id,
      userId: user.id,
      createdAt: new Date(),
      revoked: false,
    });
    // Return the created API key (not the full record for security)
    return { key: apiKeyRecord.key, id: apiKeyRecord.id };
  }

  async revoke(apiKeyId: number) {
    // Set the revoked flag to true for the given API key
    await ApiKeyModel.query().findById(apiKeyId).patch({ revoked: true });
    return { id: apiKeyId, revoked: true };
  }
}
