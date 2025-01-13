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
import { PublicRoute } from '../Auth/Jwt.guard';
import { IAccountsFilter, IAccountsTransactionsFilter } from './Accounts.types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { IAccountsFilter, IAccountsTransactionsFilter } from './Accounts.types';
// import { ZodValidationPipe } from '@/common/pipes/ZodValidation.pipe';

@Controller('accounts')
@ApiTags('accounts')
@PublicRoute()
export class AccountsController {
  constructor(private readonly accountsApplication: AccountsApplication) {}

  @Post()
  async createAccount(@Body() accountDTO: CreateAccountDTO) {
    return this.accountsApplication.createAccount(accountDTO);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Edit the given account.' })
  async editAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() accountDTO: EditAccountDTO,
  ) {
    return this.accountsApplication.editAccount(id, accountDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given account.' })
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.deleteAccount(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate the given account.' })
  async activateAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.activateAccount(id);
  }

  @Post(':id/inactivate')
  @ApiOperation({ summary: 'Inactivate the given account.' })
  async inactivateAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.inactivateAccount(id);
  }

  @Get('types')
  @ApiOperation({ summary: 'Retrieves the account types.' })
  async getAccountTypes() {
    return this.accountsApplication.getAccountTypes();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Retrieves the account transactions.' })
  async getAccountTransactions(@Query() filter: IAccountsTransactionsFilter) {
    return this.accountsApplication.getAccountsTransactions(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the account details.' })
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.getAccount(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the accounts.' })
  async getAccounts(@Query() filter: IAccountsFilter) {
    return this.accountsApplication.getAccounts(filter);
  }

}
