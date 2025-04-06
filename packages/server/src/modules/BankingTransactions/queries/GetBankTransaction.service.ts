import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { BankTransaction } from '../models/BankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BankTransactionTransformer } from './BankTransactionTransformer';

@Injectable()
export class GetBankTransactionService {
  constructor(
    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: typeof BankTransaction,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve the given cashflow transaction.
   * @param {number} cashflowTransactionId
   * @returns
   */
  public async getBankTransaction(cashflowTransactionId: number) {
    const cashflowTransaction = await this.bankTransactionModel
      .query()
      .findById(cashflowTransactionId)
      .withGraphFetched('entries.cashflowAccount')
      .withGraphFetched('entries.creditAccount')
      .withGraphFetched('transactions.account')
      .orderBy('date', 'DESC')
      .throwIfNotFound();

    this.throwErrorCashflowTransactionNotFound(cashflowTransaction);

    // Transforms the cashflow transaction model to POJO.
    return this.transformer.transform(
      cashflowTransaction,
      new BankTransactionTransformer(),
    );
  }

  /**
   * Throw not found error if the given cashflow is undefined.
   * @param {BankTransaction} bankTransaction - Bank transaction.
   */
  private throwErrorCashflowTransactionNotFound(
    bankTransaction: BankTransaction,
  ) {
    if (!bankTransaction) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_NOT_FOUND);
    }
  }
}
