import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionBillsTransformer } from './GetMatchedTransactionBillsTransformer';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import { GetMatchedTransactionsFilter } from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class GetMatchedTransactionsByBills {
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
    const { Bill } = this.tenancy.models(tenantId);

    const bills = await Bill.query();

    return this.transformer.transform(
      tenantId,
      bills,
      new GetMatchedTransactionBillsTransformer()
    );
  }
}
