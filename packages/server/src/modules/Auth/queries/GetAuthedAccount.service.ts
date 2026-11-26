import { ClsService } from 'nestjs-cls';
import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetAuthedAccountTransformer } from './GetAuthedAccount.transformer';

@Injectable()
export class GetAuthenticatedAccount {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly transformer: TransformerInjectable,
    private readonly cls: ClsService,
  ) {}

  async getAccount() {
    const account = await this.tenancyContext.getSystemUser();

    const scopedTenantId = this.cls.get<number>('scopedTenantId');
    if (scopedTenantId !== undefined) {
      return {
        ...pick(account, [
          'id',
          'firstName',
          'lastName',
          'email',
          'active',
          'verified',
          'language',
        ]),
        tenantId: scopedTenantId,
      };
    }
    return this.transformer.transform(
      account,
      new GetAuthedAccountTransformer(),
    );
  }
}
