import { Body, Controller, Delete, Param, Patch, Post, Query } from '@nestjs/common';
import { castArray, omit } from 'lodash';
import { BankingCategorizeApplication } from './BankingCategorize.application';
import { CategorizeBankTransactionRouteDto } from './dtos/CategorizeBankTransaction.dto';
import { EditCategorizeBankTransactionDto } from './dtos/EditCategorizeBankTransaction.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('banking/categorize')
@ApiTags('Banking Categorization')
@ApiCommonHeaders()
export class BankingCategorizeController {
  constructor(
    private readonly bankingCategorizeApplication: BankingCategorizeApplication,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Categorize bank transactions.' })
  @ApiBody({ type: CategorizeBankTransactionRouteDto })
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

  @Patch('/:id')
  @ApiOperation({ summary: 'Edit the categorization of a bank transaction.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Uncategorized transaction ID',
  })
  @ApiBody({ type: EditCategorizeBankTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'The categorization has been updated successfully.',
  })
  public editCategorization(
    @Param('id') uncategorizedTransactionId: number,
    @Body() body: EditCategorizeBankTransactionDto,
  ) {
    return this.bankingCategorizeApplication.editCategorization(
      Number(uncategorizedTransactionId),
      body,
    );
  }

  @Delete('/bulk')
  @ApiOperation({ summary: 'Uncategorize bank transactions in bulk.' })
  @ApiQuery({
    name: 'uncategorizedTransactionIds',
    required: true,
    type: [Number],
    isArray: true,
    description: 'Array of uncategorized transaction IDs to uncategorize',
  })
  @ApiResponse({
    status: 200,
    description: 'The bank transactions have been uncategorized successfully.',
  })
  public uncategorizeTransactionsBulk(
    @Query('uncategorizedTransactionIds')
    uncategorizedTransactionIds: number[] | number,
  ) {
    const ids = castArray(uncategorizedTransactionIds).map((id) =>
      Number(id),
    );
    return this.bankingCategorizeApplication.uncategorizeTransactionsBulk(
      ids,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Uncategorize a bank transaction.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Uncategorized transaction ID to uncategorize',
  })
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
