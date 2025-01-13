import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BankingTransactionsApplication } from './BankingTransactionsApplication.service';
import {
  IBankAccountsFilter,
  ICashflowNewCommandDTO,
} from './types/BankingTransactions.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('banking/transactions')
@PublicRoute()
export class BankingTransactionsController {
  constructor(
    private readonly bankingTransactionsApplication: BankingTransactionsApplication,
  ) {}

  @Get('')
  async getBankAccounts(@Query() filterDTO: IBankAccountsFilter) {
    return this.bankingTransactionsApplication.getBankAccounts(filterDTO);
  }

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
