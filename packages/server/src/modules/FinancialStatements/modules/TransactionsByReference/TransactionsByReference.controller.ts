import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsByReferenceApplication } from './TransactionsByReferenceApplication';
import { TransactionsByReferenceQueryDto } from './TransactionsByReferenceQuery.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('reports/transactions-by-reference')
@ApiTags('Reports')
export class TransactionsByReferenceController {
  constructor(
    private readonly transactionsByReferenceApp: TransactionsByReferenceApplication,
  ) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Transactions by reference' })
  @ApiOperation({ summary: 'Get transactions by reference' })
  async getTransactionsByReference(
    @Query() query: TransactionsByReferenceQueryDto,
  ) {
    const data = await this.transactionsByReferenceApp.getTransactions(query);

    return data;
  }
}
