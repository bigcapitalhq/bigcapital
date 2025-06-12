import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecognizedTransactionsApplication } from './RecognizedTransactions.application';

@Controller('banking/recognized')
@ApiTags('Banking Recognized Transactions')
export class BankingRecognizedTransactionsController {
  constructor(
    private readonly recognizedTransactionsApplication: RecognizedTransactionsApplication,
  ) {}

  @Get(':recognizedTransactionId')
  async getRecognizedTransaction(
    @Param('recognizedTransactionId') recognizedTransactionId: number,
  ) {
    return this.recognizedTransactionsApplication.getRecognizedTransaction(
      Number(recognizedTransactionId),
    );
  }

  @Get()
  async getRecognizedTransactions(@Query() query: any) {
    return this.recognizedTransactionsApplication.getRecognizedTransactions(query);
  }
}
