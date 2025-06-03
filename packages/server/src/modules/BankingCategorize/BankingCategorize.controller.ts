import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { castArray, omit } from 'lodash';
import { BankingCategorizeApplication } from './BankingCategorize.application';
import { CategorizeBankTransactionRouteDto } from './dtos/CategorizeBankTransaction.dto';

@Controller('banking/categorize')
export class BankingCategorizeController {
  constructor(
    private readonly bankingCategorizeApplication: BankingCategorizeApplication,
  ) {}

  @Post()
  public categorizeTransaction(
    @Body() body: CategorizeBankTransactionRouteDto,
  ) {
    return this.bankingCategorizeApplication.categorizeTransaction(
      castArray(body.uncategorizedTransactionIds),
      omit(body, 'uncategorizedTransactionIds'),
    );
  }

  @Delete('/bulk')
  public uncategorizeTransactionsBulk(
    @Query() uncategorizedTransactionIds: number[] | number,
  ) {
    return this.bankingCategorizeApplication.uncategorizeTransactionsBulk(
      castArray(uncategorizedTransactionIds),
    );
  }

  @Delete('/:id')
  public uncategorizeTransaction(
    @Param('id') uncategorizedTransactionId: number,
  ) {
    return this.bankingCategorizeApplication.uncategorizeTransaction(
      Number(uncategorizedTransactionId),
    );
  }
}
