import { Inject, Injectable } from '@nestjs/common';
import { GetRecognizedTransactionTransformer } from './GetRecognizedTransactionTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';

@Injectable()
export class GetRecognizedTransactionService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction
  ) {}

  /**
   * Retrieves the recognized transaction of the given uncategorized transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   */
  public async getRecognizedTransaction(
    uncategorizedTransactionId: number
  ) {
    const uncategorizedTransaction =
      await this.uncategorizedBankTransactionModel.query()
        .findById(uncategorizedTransactionId)
        .withGraphFetched('matchedBankTransactions')
        .withGraphFetched('recognizedTransaction.assignAccount')
        .withGraphFetched('recognizedTransaction.bankRule')
        .withGraphFetched('account')
        .throwIfNotFound();

    return this.transformer.transform(
      uncategorizedTransaction,
      new GetRecognizedTransactionTransformer()
    );
  }
}
