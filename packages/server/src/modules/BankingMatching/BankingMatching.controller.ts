import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BankingMatchingApplication } from './BankingMatchingApplication';
import { GetMatchedTransactionsFilter } from './types';
import { MatchBankTransactionDto } from './dtos/MatchBankTransaction.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('banking/matching')
@ApiTags('Banking Transactions Matching')
@ApiCommonHeaders()
export class BankingMatchingController {
  constructor(
    private readonly bankingMatchingApplication: BankingMatchingApplication,
  ) {}

  @Get('matched')
  @ApiOperation({ summary: 'Retrieves the matched transactions.' })
  async getMatchedTransactions(
    @Query('uncategorizedTransactionIds') uncategorizedTransactionIds: number[],
    @Query() filter: GetMatchedTransactionsFilter,
  ) {
    return this.bankingMatchingApplication.getMatchedTransactions(
      uncategorizedTransactionIds,
      filter,
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
