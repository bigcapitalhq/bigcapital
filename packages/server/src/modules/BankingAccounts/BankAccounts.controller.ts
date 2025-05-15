import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BankAccountsApplication } from './BankAccountsApplication.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICashflowAccountsFilter } from './types/BankAccounts.types';

@Controller('banking/accounts')
@ApiTags('banking-accounts')
export class BankAccountsController {
  constructor(private bankAccountsApplication: BankAccountsApplication) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the bank accounts.' })
  getBankAccounts(@Query() filterDto: ICashflowAccountsFilter) {
    return this.bankAccountsApplication.getBankAccounts(filterDto);
  }

  @Get(':bankAccountId/summary')
  @ApiOperation({ summary: 'Retrieve the bank account summary.' })
  getBankAccountSummary(@Param('bankAccountId') bankAccountId: number) {
    return this.bankAccountsApplication.getBankAccountSumnmary(bankAccountId);
  }

  @Post(':id/disconnect')
  @ApiOperation({
    summary: 'Disconnect the bank connection of the given bank account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bank account disconnected successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank account not found.',
  })
  async disconnectBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.disconnectBankAccount(bankAccountId);
  }

  @Post(':id/refresh')
  @ApiOperation({
    summary: 'Refresh the bank account transactions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bank account transactions refreshed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank account not found.',
  })
  async refreshBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.refreshBankAccount(bankAccountId);
  }

  @Post(':id/pause')
  @ApiOperation({
    summary: 'Pause transactions syncing of the given bank account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bank account transactions paused successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank account not found.',
  })
  async pauseBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.pauseBankAccount(bankAccountId);
  }

  @Post(':id/resume')
  @ApiOperation({
    summary: 'Resume transactions syncing of the given bank account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bank account transactions resumed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank account not found.',
  })
  async resumeBankAccount(@Param('id') bankAccountId: number) {
    return this.bankAccountsApplication.resumeBankAccount(bankAccountId);
  }
}
