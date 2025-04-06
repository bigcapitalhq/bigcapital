import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsApplication } from './AccountsApplication.service';
import { CreateAccountDTO } from './CreateAccount.dto';
import { EditAccountDTO } from './EditAccount.dto';
import { IAccountsFilter, IAccountsTransactionsFilter } from './Accounts.types';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsApplication: AccountsApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create an account' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully created.',
  })
  async createAccount(@Body() accountDTO: CreateAccountDTO) {
    return this.accountsApplication.createAccount(accountDTO);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Edit the given account.' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'The account not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The account id',
  })
  async editAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() accountDTO: EditAccountDTO,
  ) {
    return this.accountsApplication.editAccount(id, accountDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given account.' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The account not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The account id',
  })
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.deleteAccount(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate the given account.' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully activated.',
  })
  @ApiResponse({ status: 404, description: 'The account not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The account id',
  })
  async activateAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.activateAccount(id);
  }

  @Post(':id/inactivate')
  @ApiOperation({ summary: 'Inactivate the given account.' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully inactivated.',
  })
  @ApiResponse({ status: 404, description: 'The account not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The account id',
  })
  async inactivateAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.inactivateAccount(id);
  }

  @Get('types')
  @ApiOperation({ summary: 'Retrieves the account types.' })
  @ApiResponse({
    status: 200,
    description: 'The account types have been successfully retrieved.',
  })
  async getAccountTypes() {
    return this.accountsApplication.getAccountTypes();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Retrieves the account transactions.' })
  @ApiResponse({
    status: 200,
    description: 'The account transactions have been successfully retrieved.',
  })
  async getAccountTransactions(@Query() filter: IAccountsTransactionsFilter) {
    return this.accountsApplication.getAccountsTransactions(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the account details.' })
  @ApiResponse({
    status: 200,
    description: 'The account details have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The account not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The account id',
  })
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.getAccount(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the accounts.' })
  @ApiResponse({
    status: 200,
    description: 'The accounts have been successfully retrieved.',
  })
  async getAccounts(@Query() filter: IAccountsFilter) {
    return this.accountsApplication.getAccounts(filter);
  }
}
