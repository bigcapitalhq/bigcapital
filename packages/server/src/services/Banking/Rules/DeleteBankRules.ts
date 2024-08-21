import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import PromisePool from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteBankRuleSerivce } from './DeleteBankRule';

@Service()
export class DeleteBankRulesService {
  @Inject()
  private deleteBankRuleService: DeleteBankRuleSerivce;

  /**
   * Delete bank rules.
   * @param {number} tenantId
   * @param {number | Array<number>} bankRuleId
   */
  async deleteBankRules(
    tenantId: number,
    bankRuleId: number | Array<number>,
    trx?: Knex.Transaction
  ) {
    const bankRulesIds = uniq(castArray(bankRuleId));

    const results = await PromisePool.withConcurrency(1)
      .for(bankRulesIds)
      .process(async (bankRuleId: number) => {
        await this.deleteBankRuleService.deleteBankRule(
          tenantId,
          bankRuleId,
          trx
        );
      });
  }
}
