import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';
import { UncategorizedTransactionTransformer } from '../../BankingCategorize/commands/UncategorizedTransaction.transformer';

@Injectable()
export class GetUncategorizedBankTransactionService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransaction: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Retrieves specific uncategorized cashflow transaction.
   * @param {number} tenantId - Tenant id.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   */
  public async getTransaction(uncategorizedTransactionId: number) {
    const transaction = await this.uncategorizedBankTransaction
      .query()
      .findById(uncategorizedTransactionId)
      .withGraphFetched('account')
      .throwIfNotFound();

    return this.transformer.transform(
      transaction,
      new UncategorizedTransactionTransformer(),
    );
  }
}
