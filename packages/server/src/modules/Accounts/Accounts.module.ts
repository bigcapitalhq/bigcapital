import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { AccountsController } from './Accounts.controller';
import { AccountsApplication } from './AccountsApplication.service';
import { CreateAccountService } from './CreateAccount.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { CommandAccountValidators } from './CommandAccountValidators.service';
import { AccountRepository } from './repositories/Account.repository';
import { EditAccount } from './EditAccount.service';
import { DeleteAccount } from './DeleteAccount.service';
import { GetAccount } from './GetAccount.service';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ActivateAccount } from './ActivateAccount.service';
import { GetAccountTypesService } from './GetAccountTypes.service';
import { GetAccountTransactionsService } from './GetAccountTransactions.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { BankAccount } from '../BankingTransactions/models/BankAccount';
import { GetAccountsService } from './GetAccounts.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { AccountsExportable } from './AccountsExportable.service';
import { AccountsImportable } from './AccountsImportable.service';
import { BulkDeleteAccountsService } from './BulkDeleteAccounts.service';
import { ValidateBulkDeleteAccountsService } from './ValidateBulkDeleteAccounts.service';

const models = [RegisterTenancyModel(BankAccount)];

@Module({
  imports: [TenancyDatabaseModule, DynamicListModule, ...models],
  controllers: [AccountsController],
  providers: [
    AccountsApplication,
    CreateAccountService,
    TenancyContext,
    CommandAccountValidators,
    AccountRepository,
    EditAccount,
    DeleteAccount,
    GetAccount,
    TransformerInjectable,
    ActivateAccount,
    GetAccountTypesService,
    GetAccountTransactionsService,
    GetAccountsService,
    AccountsExportable,
    AccountsImportable,
    BulkDeleteAccountsService,
    ValidateBulkDeleteAccountsService,
  ],
  exports: [
    AccountRepository,
    CreateAccountService,
    ...models,
    AccountsExportable,
    AccountsImportable
  ],
})
export class AccountsModule {}
