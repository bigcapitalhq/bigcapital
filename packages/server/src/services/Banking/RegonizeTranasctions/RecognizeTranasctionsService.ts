import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { transformToMapBy } from '@/utils';
import { Inject, Service } from 'typedi';
import { PromisePool } from '@supercharge/promise-pool';

@Service()
export class RecognizeedTranasctionsService {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Regonized the uncategorized transactions.
   * @param {number} tenantId
   */
  public async recognizeTransactions(tenantId: number) {
    const { UncategorizedCashflowTransaction, BankRule } =
      this.tenancy.models(tenantId);

    const uncategorizedTranasctions =
      await UncategorizedCashflowTransaction.query().where(
        'regonized_transaction_id',
        null
      );

    const bankRules = await BankRule.query();
    const bankRulesByAccountId = transformToMapBy(bankRules, 'accountId');

    console.log(bankRulesByAccountId);

    const regonizeTransaction = (
      transaction: UncategorizedCashflowTransaction
    ) => {};

    await PromisePool.withConcurrency(MIGRATION_CONCURRENCY)
      .for(uncategorizedTranasctions)
      .process((transaction: UncategorizedCashflowTransaction, index, pool) => {
        return regonizeTransaction(transaction);
      });
  }

  public async regonizeTransaction(
    uncategorizedTransaction: UncategorizedCashflowTransaction
  ) {}
}

const MIGRATION_CONCURRENCY = 10;
