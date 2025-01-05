import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ExcludeBankTransactionsApplication } from './ExcludeBankTransactionsApplication';
import { ExcludedBankTransactionsQuery } from './types/BankTransactionsExclude.types';

@Controller('banking/transactions')
export class BankingTransactionsExcludeController {
  constructor(
    private readonly excludeBankTransactionsApplication: ExcludeBankTransactionsApplication,
  ) {}

  @Get()
  public getExcludedBankTransactions(
    @Query() query: ExcludedBankTransactionsQuery,
  ) {
    return this.excludeBankTransactionsApplication.getExcludedBankTransactions(
      query,
    );
  }

  @Post(':id/exclude')
  public excludeBankTransaction(@Param('id') id: string) {
    return this.excludeBankTransactionsApplication.excludeBankTransaction(
      Number(id),
    );
  }

  @Delete(':id/exclude')
  public unexcludeBankTransaction(@Param('id') id: string) {
    return this.excludeBankTransactionsApplication.unexcludeBankTransaction(
      Number(id),
    );
  }

  @Post('bulk/exclude')
  public excludeBankTransactions(@Body('ids') ids: number[]) {
    return this.excludeBankTransactionsApplication.excludeBankTransactions(ids);
  }

  @Delete('bulk/exclude')
  public unexcludeBankTransactions(@Body('ids') ids: number[]) {
    return this.excludeBankTransactionsApplication.unexcludeBankTransactions(
      ids,
    );
  }
}
