import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionBillsTransformer } from './GetMatchedTransactionBillsTransformer';
import { GetMatchedTransactionsFilter, MatchedTransactionPOJO } from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';

@Service()
export class GetMatchedTransactionsByBills extends GetMatchedTransactionsByType {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Bill, MatchedBankTransaction } = this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the models metadata.
    await initialize(knex, [Bill, MatchedBankTransaction]);

    // Retrieves the bill matches.
    const bills = await Bill.query().onBuild((q) => {
      q.withGraphJoined('matchedBankTransaction');
      q.whereNull('matchedBankTransaction.id');
      q.modify('published');

      if (filter.fromDate) {
        q.where('billDate', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        q.where('billDate', '<=', filter.toDate);
      }
      q.orderBy('billDate', 'DESC');
    });

    return this.transformer.transform(
      tenantId,
      bills,
      new GetMatchedTransactionBillsTransformer()
    );
  }

  /**
   * Retrieves the given bill matched transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { Bill } = this.tenancy.models(tenantId);

    const bill = await Bill.query().findById(transactionId).throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      bill,
      new GetMatchedTransactionBillsTransformer()
    );
  }
}
