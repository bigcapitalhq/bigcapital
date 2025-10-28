import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { BankingTransactionsApplication } from '../BankingTransactionsApplication.service';
import { GetPendingTransactionsQueryDto } from '../dtos/GetPendingTransactionsQuery.dto';
import { GetPendingTransactionResponseDto } from '../dtos/GetPendingTransactionResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('banking/pending')
@ApiTags('Banking Pending Transactions')
@ApiExtraModels(GetPendingTransactionResponseDto)
@ApiCommonHeaders()
export class BankingPendingTransactionsController {
  constructor(
    private readonly bankingTransactionsApplication: BankingTransactionsApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get pending bank account transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of pending bank account transactions',
    schema: {
      $ref: getSchemaPath(GetPendingTransactionResponseDto),
    },
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
