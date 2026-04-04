import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BankingMatchingApplication } from './BankingMatchingApplication';
import { MatchBankTransactionDto } from './dtos/MatchBankTransaction.dto';
import { GetMatchedTransactionsQueryDto } from './dtos/GetMatchedTransactionsQuery.dto';
import { GetMatchedTransactionsResponseDto } from './dtos/GetMatchedTransactionsResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('banking/matching')
@ApiTags('Banking Transactions Matching')
@ApiExtraModels(GetMatchedTransactionsResponseDto)
@ApiCommonHeaders()
export class BankingMatchingController {
  constructor(
    private readonly bankingMatchingApplication: BankingMatchingApplication,
  ) {}

  @Get('matched')
  @ApiOperation({ summary: 'Retrieves the matched transactions.' })
  @ApiQuery({
    name: 'uncategorizedTransactionIds',
    required: true,
    type: [Number],
    isArray: true,
    description: 'Uncategorized transaction IDs to match',
  })
  @ApiResponse({
    status: 200,
    description: 'Matched transactions (perfect and possible matches).',
    schema: { $ref: getSchemaPath(GetMatchedTransactionsResponseDto) },
  })
  async getMatchedTransactions(
    @Query('uncategorizedTransactionIds') uncategorizedTransactionIds: number[],
    @Query() filter: GetMatchedTransactionsQueryDto,
  ) {
    return this.bankingMatchingApplication.getMatchedTransactions(
      uncategorizedTransactionIds ?? [],
      filter as any,
    );
  }

  @Post('/match')
  @ApiOperation({ summary: 'Match the given uncategorized transaction.' })
  async matchTransaction(@Body() matchedTransactions: MatchBankTransactionDto) {
    return this.bankingMatchingApplication.matchTransaction(
      matchedTransactions.uncategorizedTransactions,
      matchedTransactions.matchedTransactions,
    );
  }

  @Patch('/unmatch/:uncategorizedTransactionId')
  @ApiOperation({ summary: 'Unmatch the given uncategorized transaction.' })
  async unmatchMatchedTransaction(
    @Param('uncategorizedTransactionId') uncategorizedTransactionId: number,
  ) {
    return this.bankingMatchingApplication.unmatchMatchedTransaction(
      uncategorizedTransactionId,
    );
  }
}
