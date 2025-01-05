import { Inject, Injectable } from '@nestjs/common';
import { GetBankRulesTransformer } from './GetBankRulesTransformer';
import { BankRule } from '../models/BankRule';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';

@Injectable()
export class GetBankRulesService {
  constructor(
    private transformer: TransformerInjectable,

    @Inject(BankRule.name)
    private bankRuleModel: typeof BankRule,
  ) {}

  /**
   * Retrieves the bank rules of the given account.
   * @returns {Promise<any>}
   */
  public async getBankRules(): Promise<any> {
    const bankRule = await this.bankRuleModel
      .query()
      .withGraphFetched('conditions')
      .withGraphFetched('assignAccount');

    return this.transformer.transform(
      bankRule,
      new GetBankRulesTransformer()
    );
  }
}
