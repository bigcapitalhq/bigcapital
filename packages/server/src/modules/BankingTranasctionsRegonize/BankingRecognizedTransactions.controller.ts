import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { RecognizedTransactionsApplication } from './RecognizedTransactions.application';
import { GetRecognizedTransactionResponseDto } from './dtos/GetRecognizedTransactionResponse.dto';

@Controller('banking/recognized')
@ApiTags('Banking Recognized Transactions')
@ApiExtraModels(GetRecognizedTransactionResponseDto)
export class BankingRecognizedTransactionsController {
  constructor(
    private readonly recognizedTransactionsApplication: RecognizedTransactionsApplication,
  ) {}

  @Get(':recognizedTransactionId')
  @ApiOperation({ summary: 'Get recognized transaction' })
  @ApiParam({
    name: 'recognizedTransactionId',
    description: 'The ID of the recognized transaction',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the recognized transaction details',
    schema: {
      $ref: getSchemaPath(GetRecognizedTransactionResponseDto),
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Recognized transaction not found',
  })
  async getRecognizedTransaction(
    @Param('recognizedTransactionId') recognizedTransactionId: number,
  ) {
    return this.recognizedTransactionsApplication.getRecognizedTransaction(
      Number(recognizedTransactionId),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of recognized transactions' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query parameters for filtering recognized transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of recognized transactions',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(GetRecognizedTransactionResponseDto),
      },
    },
  })
  async getRecognizedTransactions(@Query() query: any) {
    return this.recognizedTransactionsApplication.getRecognizedTransactions(
      query,
    );
  }
}
