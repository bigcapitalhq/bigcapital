import { Inject, Injectable } from '@nestjs/common';
import { ApiKeyModel } from '../models/ApiKey.model';
import { GetApiKeysTransformer } from './GetApiKeys.transformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class GetApiKeysService {
  constructor(
    private readonly injectableTransformer: TransformerInjectable,
    private readonly tenancyContext: TenancyContext,

    @Inject(ApiKeyModel.name)
    private readonly apiKeyModel: typeof ApiKeyModel,
  ) {}

  async getApiKeys() {
    const tenant = await this.tenancyContext.getTenant();
    const apiKeys = await this.apiKeyModel
      .query()
      .modify('notRevoked')
      .where({ tenantId: tenant.id });

    return this.injectableTransformer.transform(
      apiKeys,
      new GetApiKeysTransformer(),
    );
  }
}
