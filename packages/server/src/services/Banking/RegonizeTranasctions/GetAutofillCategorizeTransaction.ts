import { Inject, Service } from 'typedi';
import { castArray, first, uniq } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetAutofillCategorizeTransctionTransformer } from './GetAutofillCategorizeTransactionTransformer';

@Service()
export class GetAutofillCategorizeTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the autofill values of categorize transactions form.
   * @param {number} tenantId - Tenant id.
   * @param {Array<number> | number} uncategorizeTransactionsId - Uncategorized transactions ids.
   */
  public async getAutofillCategorizeTransaction(
    tenantId: number,
    uncategorizeTransactionsId: Array<number> | number
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);
    const uncategorizeTransactionsIds = uniq(
      castArray(uncategorizeTransactionsId)
    );
    const uncategorizedTransactions =
      await UncategorizedCashflowTransaction.query()
        .whereIn('id', uncategorizeTransactionsIds)
        .withGraphFetched('recognizedTransaction.assignAccount')
        .withGraphFetched('recognizedTransaction.bankRule')
        .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      {},
      new GetAutofillCategorizeTransctionTransformer(),
      {
        uncategorizedTransactions,
        firstUncategorizedTransaction: first(uncategorizedTransactions),
      }
    );
  }
}
