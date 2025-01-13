import { Controller, Param, Post } from '@nestjs/common';
import { BankAccountsApplication } from './BankAccountsApplication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('banking/accounts')
@ApiTags('banking-accounts')
export class BankAccountsController {
  constructor(private bankAccountsApplication: BankAccountsApplication) {}

  @Post(':id/disconnect')
  @ApiOperation({
    summary: 'Disconnect the bank connection of the given bank account.',
  })
  async disconnectBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.disconnectBankAccount(bankAccountId);
  }

  @Post(':id/refresh')
  @ApiOperation({
    summary: 'Refresh the bank account transactions.',
  })
  async refreshBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.refreshBankAccount(bankAccountId);
  }

  @Post(':id/pause')
  @ApiOperation({
    summary: 'Pause transactions syncing of the given bank account.',
  })
  async pauseBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.pauseBankAccount(bankAccountId);
  }

  @Post(':id/resume')
  @ApiOperation({
    summary: 'Resume transactions syncing of the given bank account.',
  })
  async resumeBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.resumeBankAccount(bankAccountId);
  }
}
