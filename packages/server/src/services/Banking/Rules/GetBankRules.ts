import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { GetBankRulesTransformer } from './GetBankRulesTransformer';

@Service()
export class GetBankRulesService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the bank rules of the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @returns {Promise<any>}
   */
  public async getBankRules(tenantId: number): Promise<any> {
    const { BankRule } = this.tenancy.models(tenantId);

    const bankRule = await BankRule.query()
      .withGraphFetched('conditions')
      .withGraphFetched('assignAccount');

    return this.transformer.transform(
      tenantId,
      bankRule,
      new GetBankRulesTransformer()
    );
  }
}
