import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { BankingTransactionsApplication } from '../BankingTransactionsApplication.service';
import { CreateBankTransactionDto } from '../dtos/CreateBankTransaction.dto';
import { GetBankTransactionsQueryDto } from '../dtos/GetBankTranasctionsQuery.dto';

@Controller('banking/transactions')
@ApiTags('Banking Transactions')
export class BankingTransactionsController {
  constructor(
    private readonly bankingTransactionsApplication: BankingTransactionsApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get bank account transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of bank account transactions',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  async getBankAccountTransactions(
    @Query() query: GetBankTransactionsQueryDto,
  ) {
    return this.bankingTransactionsApplication.getBankAccountTransactions(
      query,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bank transaction' })
  @ApiResponse({
    status: 201,
    description: 'The bank transaction has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiBody({ type: CreateBankTransactionDto })
  async createTransaction(@Body() transactionDTO: CreateBankTransactionDto) {
    return this.bankingTransactionsApplication.createTransaction(
      transactionDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bank transaction' })
  @ApiResponse({
    status: 200,
    description: 'The bank transaction has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank transaction not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Bank transaction ID',
  })
  async deleteTransaction(@Param('id') transactionId: string) {
    return this.bankingTransactionsApplication.deleteTransaction(
      Number(transactionId),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific bank transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the bank transaction details',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank transaction not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Bank transaction ID',
  })
  async getTransaction(@Param('id') transactionId: string) {
    return this.bankingTransactionsApplication.getTransaction(
      Number(transactionId),
    );
  }
}
