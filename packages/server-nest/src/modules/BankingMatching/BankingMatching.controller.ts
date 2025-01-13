import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BankingMatchingApplication } from './BankingMatchingApplication';
import { GetMatchedTransactionsFilter, IMatchTransactionDTO } from './types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('banking/matching')
@ApiTags('banking-transactions-matching')
export class BankingMatchingController {
  constructor(
    private readonly bankingMatchingApplication: BankingMatchingApplication
  ) {}

  @Get('matched/transactions')
  @ApiOperation({ summary: 'Retrieves the matched transactions.' })
  async getMatchedTransactions(
    @Query('uncategorizedTransactionIds') uncategorizedTransactionIds: number[],
    @Query() filter: GetMatchedTransactionsFilter
  ) {
    return this.bankingMatchingApplication.getMatchedTransactions(
      uncategorizedTransactionIds,
      filter
    );
  }

  @Post('/match/:uncategorizedTransactionId')
  @ApiOperation({ summary: 'Match the given uncategorized transaction.' })
  async matchTransaction(
    @Param('uncategorizedTransactionId') uncategorizedTransactionId: number | number[],
    @Body() matchedTransactions: IMatchTransactionDTO[]
  ) {
    return this.bankingMatchingApplication.matchTransaction(
      uncategorizedTransactionId,
      matchedTransactions
    );
  }

  @Post('/unmatch/:uncategorizedTransactionId')
  @ApiOperation({ summary: 'Unmatch the given uncategorized transaction.' })
  async unmatchMatchedTransaction(
    @Param('uncategorizedTransactionId') uncategorizedTransactionId: number
  ) {
    return this.bankingMatchingApplication.unmatchMatchedTransaction(
      uncategorizedTransactionId
    );
  }
}
