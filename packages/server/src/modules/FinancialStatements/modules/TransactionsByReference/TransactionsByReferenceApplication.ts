import { Injectable } from '@nestjs/common';
import { TransactionsByReferenceService } from './TransactionsByReference.service';
import { ITransactionsByReferenceQuery } from './TransactionsByReference.types';

@Injectable()
export class TransactionsByReferenceApplication {
  constructor(
    private readonly transactionsByReferenceService: TransactionsByReferenceService,
  ) {}

  /**
   * Retrieve accounts transactions by given reference id and type.
   * @param {ITransactionsByReferenceQuery} query - Transactions by reference query.
   * @returns {Promise<ITransactionsByReferencePojo>}
   */
  public async getTransactions(query: ITransactionsByReferenceQuery) {
    return this.transactionsByReferenceService.getTransactionsByReference(
      query,
    );
  }
}
