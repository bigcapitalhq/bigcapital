import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsByReferenceApplication } from './TransactionsByReferenceApplication';
import { ITransactionsByReferenceQuery } from './TransactionsByReference.types';

@Controller('reports/transactions-by-reference')
export class TransactionsByReferenceController {
  constructor(
    private readonly transactionsByReferenceApp: TransactionsByReferenceApplication,
  ) {}

  @Get()
  async getTransactionsByReference(
    @Query() query: ITransactionsByReferenceQuery,
  ) {
    const data = await this.transactionsByReferenceApp.getTransactions(query);

    return data;
  }
}
