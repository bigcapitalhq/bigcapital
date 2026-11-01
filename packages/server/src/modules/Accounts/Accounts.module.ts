import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { AccountsController } from './Accounts.controller';
import { AccountsApplication } from './AccountsApplication.service';
import { CreateAccountService } from './CreateAccount.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { CommandAccountValidators } from './CommandAccountValidators.service';
import { AccountRepository } from './repositories/Account.repository';
import { EditAccount } from './EditAccount.service';
import { DeleteAccount } from './DeleteAccount.service';
import { GetAccount } from './GetAccount.service';
import { ActivateAccount } from './ActivateAccount.service';
import { GetAccountTypesService } from './GetAccountTypes.service';
import { GetAccountTransactionsService } from './GetAccountTransactions.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { BankAccount } from '../BankingTransactions/models/BankAccount';
import { GetAccountsService } from './GetAccounts.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { AccountsExportable } from './AccountsExportable.service';
import { AccountsImportable } from './AccountsImportable.service';
import { BulkActivateAccountsService } from './BulkActivateAccounts.service';
import { BulkDeleteAccountsService } from './BulkDeleteAccounts.service';
import { ValidateBulkDeleteAccountsService } from './ValidateBulkDeleteAccounts.service';
import { AccountsSettingsService } from './AccountsSettings.service';

const models = [RegisterTenancyModel(BankAccount)];

@Module({
  imports: [TenancyModule, TenancyDatabaseModule, DynamicListModule, ...models],
  controllers: [AccountsController],
  providers: [
    AccountsApplication,
    AccountsSettingsService,
    CreateAccountService,
    CommandAccountValidators,
    AccountRepository,
    EditAccount,
    DeleteAccount,
    GetAccount,
    ActivateAccount,
    GetAccountTypesService,
    GetAccountTransactionsService,
    GetAccountsService,
    AccountsExportable,
    AccountsImportable,
    BulkDeleteAccountsService,
    BulkActivateAccountsService,
    ValidateBulkDeleteAccountsService,
  ],
  exports: [
    AccountRepository,
    CreateAccountService,
    AccountsSettingsService,
    ...models,
    AccountsExportable,
    AccountsImportable,
  ],
})
export class AccountsModule {}
