import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { AccountsApplication } from './AccountsApplication.service';
import { CreateAccountDTO } from './CreateAccount.dto';
import { EditAccountDTO } from './EditAccount.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AccountResponseDto } from './dtos/AccountResponse.dto';
import { AccountTypeResponseDto } from './dtos/AccountTypeResponse.dto';
import { GetAccountTransactionResponseDto } from './dtos/GetAccountTransactionResponse.dto';
import { GetAccountTransactionsQueryDto } from './dtos/GetAccountTransactionsQuery.dto';
import { GetAccountsQueryDto } from './dtos/GetAccountsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('accounts')
@ApiTags('Accounts')
@ApiExtraModels(AccountResponseDto)
@ApiExtraModels(AccountTypeResponseDto)
@ApiExtraModels(GetAccountTransactionResponseDto)
@ApiCommonHeaders()
export class AccountsController {
  constructor(private readonly accountsApplication: AccountsApplication) { }

  @Post()
  @ApiOperation({ summary: 'Create an account' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully created.',
  })
  async createAccount(@Body() accountDTO: CreateAccountDTO) {
    return this.accountsApplication.createAccount(accountDTO);
  }

  @Put(':id')
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
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(AccountTypeResponseDto),
      },
    },
  })
  async getAccountTypes() {
    return this.accountsApplication.getAccountTypes();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Retrieves the account transactions.' })
  @ApiResponse({
    status: 200,
    description: 'The account transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(GetAccountTransactionResponseDto),
      },
    },
  })
  async getAccountTransactions(
    @Query() filter: GetAccountTransactionsQueryDto,
  ) {
    return this.accountsApplication.getAccountsTransactions(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the account details.' })
  @ApiResponse({
    status: 200,
    description: 'The account details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(AccountResponseDto) },
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
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(AccountResponseDto) },
    },
  })
  @ApiQuery({
    name: 'onlyInactive',
    required: false,
    type: Boolean,
    description: 'Filter to show only inactive accounts',
  })
  @ApiQuery({
    name: 'structure',
    required: false,
    type: String,
    description: 'Structure type for the accounts list',
  })
  async getAccounts(@Query() filter: GetAccountsQueryDto) {
    return this.accountsApplication.getAccounts(filter);
  }
}
