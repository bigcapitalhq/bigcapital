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
import { IAccountsTransactionsFilter } from './Accounts.types';
// import { IAccountsFilter, IAccountsTransactionsFilter } from './Accounts.types';
// import { ZodValidationPipe } from '@/common/pipes/ZodValidation.pipe';

@Controller('accounts')
@PublicRoute()
export class AccountsController {
  constructor(private readonly accountsApplication: AccountsApplication) {}

  @Post()
  async createAccount(@Body() accountDTO: CreateAccountDTO) {
    return this.accountsApplication.createAccount(accountDTO);
  }

  @Post(':id')
  async editAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() accountDTO: EditAccountDTO,
  ) {
    return this.accountsApplication.editAccount(id, accountDTO);
  }

  @Delete(':id')
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.deleteAccount(id);
  }

  @Post(':id/activate')
  async activateAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.activateAccount(id);
  }

  @Post(':id/inactivate')
  async inactivateAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.inactivateAccount(id);
  }

  @Get('types')
  async getAccountTypes() {
    return this.accountsApplication.getAccountTypes();
  }

  @Get('transactions')
  async getAccountTransactions(@Query() filter: IAccountsTransactionsFilter) {
    return this.accountsApplication.getAccountsTransactions(filter);
  }

  @Get(':id')
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsApplication.getAccount(id);
  }

  // @Get()
  // async getAccounts(@Query() filter: IAccountsFilter) {
  //   return this.accountsApplication.getAccounts(filter);
  // }

}
