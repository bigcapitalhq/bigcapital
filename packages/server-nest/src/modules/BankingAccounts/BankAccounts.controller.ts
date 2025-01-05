import { Controller, Param, Post } from '@nestjs/common';
import { BankAccountsApplication } from './BankAccountsApplication.service';

@Controller('banking/accounts')
export class BankAccountsController {
  constructor(private bankAccountsApplication: BankAccountsApplication) {}

  @Post(':id/disconnect')
  async disconnectBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.disconnectBankAccount(bankAccountId);
  }

  @Post(':id/refresh')
  async refreshBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.refreshBankAccount(bankAccountId);
  }

  @Post(':id/pause')
  async pauseBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.pauseBankAccount(bankAccountId);
  }

  @Post(':id/resume')
  async resumeBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.resumeBankAccount(bankAccountId);
  }
}
