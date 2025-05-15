import { Module } from '@nestjs/common';
import { BankAccountsApplication } from './BankAccountsApplication.service';
import { DisconnectBankAccountService } from './commands/DisconnectBankAccount.service';
import { RefreshBankAccountService } from './commands/RefreshBankAccount.service';
import { ResumeBankAccountFeedsService } from './commands/ResumeBankAccountFeeds.service';
import { PauseBankAccountFeeds } from './commands/PauseBankAccountFeeds.service';
import { DeleteUncategorizedTransactionsOnAccountDeleting } from './subscribers/DeleteUncategorizedTransactionsOnAccountDeleting';
import { DisconnectPlaidItemOnAccountDeleted } from './subscribers/DisconnectPlaidItemOnAccountDeleted';
import { BankAccountsController } from './BankAccounts.controller';
import { BankingPlaidModule } from '../BankingPlaid/BankingPlaid.module';
import { PlaidModule } from '../Plaid/Plaid.module';
import { BankRulesModule } from '../BankRules/BankRules.module';
import { BankingTransactionsRegonizeModule } from '../BankingTranasctionsRegonize/BankingTransactionsRegonize.module';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { GetBankAccountsService } from './queries/GetBankAccounts';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { GetBankAccountSummary } from './queries/GetBankAccountSummary';

@Module({
  imports: [
    BankingPlaidModule,
    PlaidModule,
    BankRulesModule,
    BankingTransactionsRegonizeModule,
    BankingTransactionsModule,
    DynamicListModule
  ],
  providers: [
    DisconnectBankAccountService,
    RefreshBankAccountService,
    ResumeBankAccountFeedsService,
    PauseBankAccountFeeds,
    DeleteUncategorizedTransactionsOnAccountDeleting,
    DisconnectPlaidItemOnAccountDeleted,
    BankAccountsApplication,
    GetBankAccountsService,
    GetBankAccountSummary
  ],
  exports: [BankAccountsApplication],
  controllers: [BankAccountsController],
})
export class BankAccountsModule {}
