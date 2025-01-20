import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsByReferenceApplication } from './TransactionsByReferenceApplication';
import { ITransactionsByReferenceQuery } from './TransactionsByReference.types';
import { PublicRoute } from '@/modules/Auth/Jwt.guard';

@Controller('reports/transactions-by-reference')
@PublicRoute()
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
