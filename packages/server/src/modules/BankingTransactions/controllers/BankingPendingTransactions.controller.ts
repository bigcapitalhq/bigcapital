import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BankingTransactionsApplication } from '../BankingTransactionsApplication.service';
import { GetPendingTransactionsQueryDto } from '../dtos/GetPendingTransactionsQuery.dto';

@Controller('banking/pending')
@ApiTags('Banking Pending Transactions')
export class BankingPendingTransactionsController {
  constructor(
    private readonly bankingTransactionsApplication: BankingTransactionsApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get pending bank account transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of pending bank account transactions',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    type: Number,
    description: 'Filter by bank account ID',
  })
  async getPendingTransactions(@Query() query: GetPendingTransactionsQueryDto) {
    return this.bankingTransactionsApplication.getPendingBankAccountTransactions(
      query,
    );
  }
}
