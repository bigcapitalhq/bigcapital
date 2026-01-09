import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BankAccountsApplication } from './BankAccountsApplication.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankAccountsQueryDto } from './dtos/BankAccountsQuery.dto';
import { BankAccountResponseDto } from './dtos/BankAccountResponse.dto';

@Controller('banking/accounts')
@ApiTags('Bank Accounts')
export class BankAccountsController {
  constructor(private bankAccountsApplication: BankAccountsApplication) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve the bank accounts.' })
  @ApiQuery({
    name: 'query',
    description: 'Query parameters for the bank accounts list.',
    type: BankAccountsQueryDto,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of bank accounts retrieved successfully.',
    type: [BankAccountResponseDto],
  })
  getBankAccounts(@Query() filterDto: BankAccountsQueryDto) {
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
