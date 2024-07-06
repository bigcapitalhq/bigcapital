import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import {
  GetMatchedTransactionsFilter,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';

@Service()
export class GetMatchedTransactionsByInvoices extends GetMatchedTransactionsByType {
  @Inject()
  protected tenancy: HasTenancyService;

  @Inject()
  protected transformer: TransformerInjectable;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ): Promise<MatchedTransactionsPOJO> {
    const { SaleInvoice, MatchedBankTransaction } =
      this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the models metadata.
    await initialize(knex, [SaleInvoice, MatchedBankTransaction]);

    // Retrieve the invoices that not matched, unpaid.
    const invoices = await SaleInvoice.query().onBuild((q) => {
      q.withGraphJoined('matchedBankTransaction');
      q.whereNull('matchedBankTransaction.id');
      q.modify('unpaid');
      q.modify('published');

      if (filter.fromDate) {
        q.where('invoiceDate', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        q.where('invoiceDate', '<=', filter.toDate);
      }
      q.orderBy('invoiceDate', 'DESC');
    });

    return this.transformer.transform(
      tenantId,
      invoices,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }

  /**
   * Retrieves the matched transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoice = await SaleInvoice.query().findById(transactionId);

    return this.transformer.transform(
      tenantId,
      invoice,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }
}
