import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ExcludeBankTransactionsApplication } from './ExcludeBankTransactionsApplication';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { GetExcludedBankTransactionResponseDto } from './dtos/GetExcludedBankTransactionResponse.dto';
import { ExcludeBankTransactionsBulkDto } from './dtos/ExcludeBankTransactionsBulk.dto';
import { GetExcludedBankTransactionsQueryDto } from './dtos/GetExcludedBankTransactionsQuery.dto';

@Controller('banking/exclude')
@ApiTags('Banking Transactions')
@ApiExtraModels(
  GetExcludedBankTransactionResponseDto,
  ExcludeBankTransactionsBulkDto,
  PaginatedResponseDto,
)
@ApiCommonHeaders()
export class BankingTransactionsExcludeController {
  constructor(
    private readonly excludeBankTransactionsApplication: ExcludeBankTransactionsApplication,
  ) {}

  @Put('bulk')
  @ApiOperation({ summary: 'Exclude the given bank transactions.' })
  @ApiResponse({
    status: 200,
    description: 'Bank transactions excluded successfully.',
  })
  public excludeBankTransactions(@Body() body: ExcludeBankTransactionsBulkDto) {
    return this.excludeBankTransactionsApplication.excludeBankTransactions(
      body.ids,
    );
  }

  @Delete('bulk')
  @ApiOperation({ summary: 'Unexclude the given bank transactions.' })
  @ApiResponse({
    status: 200,
    description: 'Bank transactions unexcluded successfully.',
  })
  public unexcludeBankTransactions(
    @Body() body: ExcludeBankTransactionsBulkDto,
  ) {
    return this.excludeBankTransactionsApplication.unexcludeBankTransactions(
      body.ids,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the excluded bank transactions.' })
  @ApiResponse({
    status: 200,
    description:
      'The excluded bank transactions has been retrieved successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(GetExcludedBankTransactionResponseDto),
              },
            },
          },
        },
      ],
    },
  })
  public getExcludedBankTransactions(
    @Query() query: GetExcludedBankTransactionsQueryDto,
  ) {
    return this.excludeBankTransactionsApplication.getExcludedBankTransactions(
      query as any,
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
