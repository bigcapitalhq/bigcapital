import { Injectable } from '@nestjs/common';
import { TransactionsByReferenceService } from './TransactionsByReference.service';
import { TransactionsByReferenceQueryDto } from './TransactionsByReferenceQuery.dto';

@Injectable()
export class TransactionsByReferenceApplication {
  constructor(
    private readonly transactionsByReferenceService: TransactionsByReferenceService,
  ) { }

  /**
   * Retrieve accounts transactions by given reference id and type.
   * @param {TransactionsByReferenceQueryDto} query - Transactions by reference query.
   * @returns {Promise<ITransactionsByReferencePojo>}
   */
  public async getTransactions(query: TransactionsByReferenceQueryDto) {
    return this.transactionsByReferenceService.getTransactionsByReference(
      query,
    );
  }
}
