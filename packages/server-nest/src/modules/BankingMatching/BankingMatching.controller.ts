import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BankingMatchingApplication } from './BankingMatchingApplication';
import { GetMatchedTransactionsFilter, IMatchTransactionDTO } from './types';

@Controller('banking/matching')
export class BankingMatchingController {
  constructor(
    private readonly bankingMatchingApplication: BankingMatchingApplication
  ) {}

  @Get('matched/transactions')
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
  async unmatchMatchedTransaction(
    @Param('uncategorizedTransactionId') uncategorizedTransactionId: number
  ) {
    return this.bankingMatchingApplication.unmatchMatchedTransaction(
      uncategorizedTransactionId
    );
  }
}
