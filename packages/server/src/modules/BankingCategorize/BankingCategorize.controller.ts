import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { castArray, omit } from 'lodash';
import { BankingCategorizeApplication } from './BankingCategorize.application';
import { CategorizeBankTransactionRouteDto } from './dtos/CategorizeBankTransaction.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('banking/categorize')
@ApiTags('banking-categorization')
export class BankingCategorizeController {
  constructor(
    private readonly bankingCategorizeApplication: BankingCategorizeApplication,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Categorize bank transactions.' })
  @ApiResponse({
    status: 200,
    description: 'The bank transactions have been categorized successfully.',
  })
  public categorizeTransaction(
    @Body() body: CategorizeBankTransactionRouteDto,
  ) {
    return this.bankingCategorizeApplication.categorizeTransaction(
      castArray(body.uncategorizedTransactionIds),
      omit(body, 'uncategorizedTransactionIds'),
    );
  }

  @Delete('/bulk')
  @ApiOperation({ summary: 'Uncategorize bank transactions.' })
  @ApiResponse({
    status: 200,
    description: 'The bank transactions have been uncategorized successfully.',
  })
  public uncategorizeTransactionsBulk(
    @Query() uncategorizedTransactionIds: number[] | number,
  ) {
    return this.bankingCategorizeApplication.uncategorizeTransactionsBulk(
      castArray(uncategorizedTransactionIds),
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Uncategorize a bank transaction.' })
  @ApiResponse({
    status: 200,
    description: 'The bank transaction has been uncategorized successfully.',
  })
  public uncategorizeTransaction(
    @Param('id') uncategorizedTransactionId: number,
  ) {
    return this.bankingCategorizeApplication.uncategorizeTransaction(
      Number(uncategorizedTransactionId),
    );
  }
}
