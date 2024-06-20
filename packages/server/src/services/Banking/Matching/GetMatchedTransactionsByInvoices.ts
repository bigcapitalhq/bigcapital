import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import {
  GetMatchedTransactionsFilter,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
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
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ): Promise<MatchedTransactionsPOJO> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoices = await SaleInvoice.query();

    return this.transformer.transform(
      tenantId,
      invoices,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    console.log(transactionId);

    const invoice = await SaleInvoice.query().findById(transactionId);

    return this.transformer.transform(
      tenantId,
      invoice,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }
}
