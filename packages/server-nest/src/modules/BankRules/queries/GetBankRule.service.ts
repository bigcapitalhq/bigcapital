import { Inject, Injectable } from '@nestjs/common';
import { GetBankRuleTransformer } from './GetBankRuleTransformer';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { BankRule } from '../models/BankRule';
import { GetBankRulesTransformer } from './GetBankRulesTransformer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetBankRuleService {
  constructor(
    @Inject(BankRule.name)
    private bankRuleModel: TenantModelProxy<typeof BankRule>,
    private transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the bank rule.
   * @param {number} ruleId
   * @returns {Promise<any>}
   */
  async getBankRule(ruleId: number): Promise<any> {
    const bankRule = await this.bankRuleModel()
      .query()
      .findById(ruleId)
      .withGraphFetched('conditions')
      .withGraphFetched('assignAccount');

    return this.transformer.transform(bankRule, new GetBankRulesTransformer());
  }
}
