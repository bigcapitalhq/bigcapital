import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ApiKeyModel } from '../models/ApiKey.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { AuthApiKeyPrefix } from '../Auth.constants';

@Injectable()
export class GenerateApiKey {
  constructor(
    private readonly tenancyContext: TenancyContext,
    @Inject(ApiKeyModel.name)
    private readonly apiKeyModel: typeof ApiKeyModel,
  ) { }

  /**
   * Generates a new secure API key for the current tenant and system user.
   * The key is saved in the database and returned (only the key and id for security).
   * @param {string} name - Optional name for the API key.
   * @returns {Promise<{ key: string; id: number }>} The generated API key and its database id.
   */
  async generate(name?: string) {
    const tenant = await this.tenancyContext.getTenant();
    const user = await this.tenancyContext.getSystemUser();

    // Generate a secure random API key
    const key = `${AuthApiKeyPrefix}${crypto.randomBytes(48).toString('hex')}`;
    // Save the API key to the database
    const apiKeyRecord = await this.apiKeyModel.query().insert({
      key,
      name,
      tenantId: tenant.id,
      userId: user.id,
      createdAt: new Date(),
      revokedAt: null,
    });
    // Return the created API key (not the full record for security)
    return { key: apiKeyRecord.key, id: apiKeyRecord.id };
  }

  /**
   * Revokes an API key by setting its revokedAt timestamp.
   * @param {number} apiKeyId - The id of the API key to revoke.
   * @returns {Promise<{ id: number; revoked: boolean }>} The id of the revoked API key and a revoked flag.
   */
  async revoke(apiKeyId: number) {
    // Set the revoked flag to true for the given API key
    await ApiKeyModel.query()
      .findById(apiKeyId)
      .patch({ revokedAt: new Date() });

    return { id: apiKeyId, revoked: true };
  }
}
