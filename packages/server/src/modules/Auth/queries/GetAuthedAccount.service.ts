import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetAuthedAccountTransformer } from './GetAuthedAccount.transformer';

@Injectable()
export class GetAuthenticatedAccount {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly transformer: TransformerInjectable,
  ) {}

  async getAccount() {
    const account = await this.tenancyContext.getSystemUser();

    return this.transformer.transform(
      account,
      new GetAuthedAccountTransformer(),
    );
  }
}
