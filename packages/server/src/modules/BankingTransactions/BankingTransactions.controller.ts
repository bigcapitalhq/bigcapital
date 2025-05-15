import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankingTransactionsApplication } from './BankingTransactionsApplication.service';
import {
  IBankAccountsFilter,
  ICashflowAccountTransactionsQuery,
} from './types/BankingTransactions.types';
import { CreateBankTransactionDto } from './dtos/CreateBankTransaction.dto';

@Controller('banking/transactions')
@ApiTags('banking-transactions')
export class BankingTransactionsController {
  constructor(
    private readonly bankingTransactionsApplication: BankingTransactionsApplication,
  ) {}

  @Get()
  async getBankAccountTransactions(
    @Query() query: ICashflowAccountTransactionsQuery,
  ) {
    return this.bankingTransactionsApplication.getBankAccountTransactions(
      query,
    );
  }

  @Post()
  async createTransaction(@Body() transactionDTO: CreateBankTransactionDto) {
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
