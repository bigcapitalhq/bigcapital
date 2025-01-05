import { Inject, Injectable } from '@nestjs/common';
import { castArray, first, uniq } from 'lodash';
import { GetAutofillCategorizeTransctionTransformer } from './GetAutofillCategorizeTransactionTransformer';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';

@Injectable()
export class GetAutofillCategorizeTransactionService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Retrieves the autofill values of categorize transactions form.
   * @param {Array<number> | number} uncategorizeTransactionsId - Uncategorized transactions ids.
   */
  public async getAutofillCategorizeTransaction(
    uncategorizeTransactionsId: Array<number> | number
  ) {
    const uncategorizeTransactionsIds = uniq(
      castArray(uncategorizeTransactionsId)
    );
    const uncategorizedTransactions =
      await this.uncategorizedBankTransactionModel.query()
        .whereIn('id', uncategorizeTransactionsIds)
        .withGraphFetched('recognizedTransaction.assignAccount')
        .withGraphFetched('recognizedTransaction.bankRule')
        .throwIfNotFound();

    return this.transformer.transform(
      {},
      new GetAutofillCategorizeTransctionTransformer(),
      {
        uncategorizedTransactions,
        firstUncategorizedTransaction: first(uncategorizedTransactions),
      }
    );
  }
}
