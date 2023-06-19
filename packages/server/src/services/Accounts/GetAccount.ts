import { Service, Inject } from 'typedi';
import I18nService from '@/services/I18n/I18nService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { AccountTransformer } from './AccountTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetAccount {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private i18nService: I18nService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the given account details.
   * @param {number} tenantId
   * @param {number} accountId
   */
  public getAccount = async (tenantId: number, accountId: number) => {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Find the given account or throw not found error.
    const account = await Account.query().findById(accountId).throwIfNotFound();

    const accountsGraph = await accountRepository.getDependencyGraph();

    // Transforms the account model to POJO.
    const transformed = await this.transformer.transform(
      tenantId,
      account,
      new AccountTransformer(),
      { accountsGraph }
    );
    return this.i18nService.i18nApply(
      [['accountTypeLabel'], ['accountNormalFormatted']],
      transformed,
      tenantId
    );
  };
}
