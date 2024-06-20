import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import { GetMatchedTransactionsFilter } from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class GetMatchedTransactionsByInvoices {
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
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoices = await SaleInvoice.query();

    return this.transformer.transform(
      tenantId,
      invoices,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }
}
