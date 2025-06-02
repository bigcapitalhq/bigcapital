import { Controller, Get, Param, Query } from '@nestjs/common';
import { BankingTransactionsApplication } from '../BankingTransactions/BankingTransactionsApplication.service';
import { ApiTags } from '@nestjs/swagger';
import { RecognizedTransactionsApplication } from './RecognizedTransactions.application';

@Controller('banking/recognized')
@ApiTags('banking-recognized')
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
