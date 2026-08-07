import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsByReferenceApplication } from './TransactionsByReferenceApplication';
import { TransactionsByReferenceQueryDto } from './TransactionsByReferenceQuery.dto';
import { TransactionsByReferenceResponseDto } from './TransactionsByReferenceResponse.dto';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('reports/transactions-by-reference')
@ApiTags('Reports')
@ApiExtraModels(NumberFormatQueryDto, TransactionsByReferenceResponseDto)
export class TransactionsByReferenceController {
  constructor(
    private readonly transactionsByReferenceApp: TransactionsByReferenceApplication,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Transactions by reference',
    schema: { $ref: getSchemaPath(TransactionsByReferenceResponseDto) },
  })
  @ApiOperation({ summary: 'Get transactions by reference' })
  @ApiQuery({
    name: 'numberFormat',
    required: false,
    description:
      'Number formatting options (serialized as bracket notation, e.g. numberFormat[precision]=2)',
    schema: { $ref: getSchemaPath(NumberFormatQueryDto) },
  })
  async getTransactionsByReference(
    @Query() query: TransactionsByReferenceQueryDto,
  ) {
    const data = await this.transactionsByReferenceApp.getTransactions(query);

    return data;
  }
}
