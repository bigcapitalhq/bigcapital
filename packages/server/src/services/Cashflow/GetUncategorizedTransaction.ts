import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { UncategorizedTransactionTransformer } from './UncategorizedTransactionTransformer';

@Service()
export class GetUncategorizedTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves specific uncategorized cashflow transaction.
   * @param {number} tenantId - Tenant id.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   */
  public async getTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const transaction = await UncategorizedCashflowTransaction.query()
      .findById(uncategorizedTransactionId)
      .withGraphFetched('account')
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      transaction,
      new UncategorizedTransactionTransformer()
    );
  }
}
