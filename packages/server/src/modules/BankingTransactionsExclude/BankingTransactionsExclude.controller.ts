import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExcludeBankTransactionsApplication } from './ExcludeBankTransactionsApplication';
import { ExcludedBankTransactionsQuery } from './types/BankTransactionsExclude.types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('banking/exclude')
@ApiTags('banking-transactions')
export class BankingTransactionsExcludeController {
  constructor(
    private readonly excludeBankTransactionsApplication: ExcludeBankTransactionsApplication,
  ) {}

  @Put('bulk')
  @ApiOperation({ summary: 'Exclude the given bank transactions.' })
  public excludeBankTransactions(@Body('ids') ids: number[]) {
    return this.excludeBankTransactionsApplication.excludeBankTransactions(ids);
  }

  @Delete('bulk')
  @ApiOperation({ summary: 'Unexclude the given bank transactions.' })
  public unexcludeBankTransactions(@Body('ids') ids: number[]) {
    return this.excludeBankTransactionsApplication.unexcludeBankTransactions(
      ids,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the excluded bank transactions.' })
  public getExcludedBankTransactions(
    @Query() query: ExcludedBankTransactionsQuery,
  ) {
    return this.excludeBankTransactionsApplication.getExcludedBankTransactions(
      query,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Exclude the given bank transaction.' })
  public excludeBankTransaction(@Param('id') id: string) {
    return this.excludeBankTransactionsApplication.excludeBankTransaction(
      Number(id),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unexclude the given bank transaction.' })
  public unexcludeBankTransaction(@Param('id') id: string) {
    return this.excludeBankTransactionsApplication.unexcludeBankTransaction(
      Number(id),
    );
  }
}
