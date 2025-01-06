import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BankingTransactionsApplication } from './BankingTransactionsApplication.service';
import { ICashflowNewCommandDTO } from './types/BankingTransactions.types';

@Controller('banking/transactions')
export class BankingTransactionsController {
  constructor(
    private readonly bankingTransactionsApplication: BankingTransactionsApplication,
  ) {}

  @Post()
  async createTransaction(@Body() transactionDTO: ICashflowNewCommandDTO) {
    return this.bankingTransactionsApplication.createTransaction(
      transactionDTO,
    );
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') transactionId: string) {
    return this.bankingTransactionsApplication.deleteTransaction(
      Number(transactionId),
    );
  }

  @Get(':id')
  async getTransaction(@Param('id') transactionId: string) {
    return this.bankingTransactionsApplication.getTransaction(
      Number(transactionId),
    );
  }
}
