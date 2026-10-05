import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  /**
   * Generates a new secure API key for the current tenant and system user.
   * Only a SHA-256 hash of the key is stored; the raw key is returned once
   * to the caller and can never be retrieved again.
   * @param {string} name - Optional name for the API key.
   * @returns {Promise<{ key: string; id: number }>} The generated API key and its database id.
   */
  async generate(name?: string) {
    const tenant = await this.tenancyContext.getTenant();
    const user = await this.tenancyContext.getSystemUser();

    // Generate a secure random API key.
    const key = `${AuthApiKeyPrefix}${crypto.randomBytes(48).toString('hex')}`;

    // Store only the SHA-256 hash of the key and a short displayable prefix.
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');

    // Save the API key to the database.
    const apiKeyRecord = await this.apiKeyModel.query().insert({
      keyHash,
      keyPrefix: key.substring(0, 8),
      name,
      tenantId: tenant.id,
      userId: user.id,
      createdAt: new Date(),
      revokedAt: null,
    });
    // Return the created API key (not the full record for security).
    return { key, id: apiKeyRecord.id };
  }

  /**
   * Revokes an API key by setting its revokedAt timestamp.
   * @param {number} apiKeyId - The id of the API key to revoke.
   * @returns {Promise<{ id: number; revoked: boolean }>} The id of the revoked API key and a revoked flag.
   */
  async revoke(apiKeyId: number) {
    const tenant = await this.tenancyContext.getTenant();

    const affected = await this.apiKeyModel
      .query()
      .where({ id: apiKeyId, tenantId: tenant.id })
      .patch({ revokedAt: new Date() });

    if (affected === 0) {
      throw new NotFoundException('API key not found.');
    }
    return { id: apiKeyId, revoked: true };
  }
}
