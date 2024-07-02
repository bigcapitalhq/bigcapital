import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetRecognizedTransactionTransformer } from './GetRecognizedTransactionTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetRecognizedTransactionService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the recognized transaction of the given uncategorized transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   */
  public async getRecognizedTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const uncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .withGraphFetched('matchedBankTransactions')
        .withGraphFetched('recognizedTransaction.assignAccount')
        .withGraphFetched('recognizedTransaction.bankRule')
        .withGraphFetched('account')
        .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      uncategorizedTransaction,
      new GetRecognizedTransactionTransformer()
    );
  }
}
