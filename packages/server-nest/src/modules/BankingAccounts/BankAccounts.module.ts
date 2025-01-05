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

@Module({
  imports: [BankingPlaidModule, PlaidModule, BankRulesModule],
  providers: [
    DisconnectBankAccountService,
    RefreshBankAccountService,
    ResumeBankAccountFeedsService,
    PauseBankAccountFeeds,
    // DeleteUncategorizedTransactionsOnAccountDeleting,
    DisconnectPlaidItemOnAccountDeleted,
    BankAccountsApplication
  ],
  exports: [BankAccountsApplication],
  controllers: [BankAccountsController],
})
export class BankAccountsModule {}
