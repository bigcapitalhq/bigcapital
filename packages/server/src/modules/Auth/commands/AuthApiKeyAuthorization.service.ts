import { Inject, Injectable } from '@nestjs/common';
import { ApiKeyModel } from '../models/ApiKey.model';

@Injectable()
export class AuthApiKeyAuthorizeService {
  constructor(
    @Inject(ApiKeyModel.name)
    private readonly apikeyModel: typeof ApiKeyModel,
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
    return true;
  }
}
