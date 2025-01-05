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
// import { GetAccountsService } from './GetAccounts.service';

@Module({
  imports: [TenancyDatabaseModule],
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
  ],
  exports: [
    AccountRepository,
    CreateAccountService,
  ]
})
export class AccountsModule {}
