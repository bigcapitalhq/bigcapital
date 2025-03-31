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
import { IBankAccountsFilter } from './types/BankingTransactions.types';
import { PublicRoute } from '../Auth/guards/Jwt.local';
import { ApiTags } from '@nestjs/swagger';
import { CreateBankTransactionDto } from './dtos/CreateBankTransaction.dto';

@Controller('banking/transactions')
@ApiTags('banking-transactions')
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
