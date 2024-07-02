import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { BankRule } from '@/models/BankRule';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { GetBankRuleTransformer } from './GetBankRuleTransformer';

@Service()
export class GetBankRuleService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the bank rule.
   * @param {number} tenantId
   * @param {number} ruleId
   * @returns {Promise<any>}
   */
  async getBankRule(tenantId: number, ruleId: number): Promise<any> {
    const { BankRule } = this.tenancy.models(tenantId);

    const bankRule = await BankRule.query()
      .findById(ruleId)
      .withGraphFetched('conditions');

    return this.transformer.transform(
      tenantId,
      bankRule,
      new GetBankRuleTransformer()
    );
  }
}
