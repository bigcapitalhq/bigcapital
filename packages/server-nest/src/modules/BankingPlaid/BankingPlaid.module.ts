import { Module } from "@nestjs/common";
import { PlaidUpdateTransactionsOnItemCreatedSubscriber } from "./subscribers/PlaidUpdateTransactionsOnItemCreatedSubscriber";
import { PlaidUpdateTransactions } from "./command/PlaidUpdateTransactions";
import { PlaidSyncDb } from "./command/PlaidSyncDB";
import { PlaidWebooks } from "./command/PlaidWebhooks";
import { PlaidLinkTokenService } from "./queries/GetPlaidLinkToken.service";
import { PlaidApplication } from "./PlaidApplication";


@Module({
  providers: [
    PlaidUpdateTransactions,
    PlaidSyncDb,
    PlaidWebooks,
    PlaidLinkTokenService,
    PlaidApplication,
    PlaidUpdateTransactionsOnItemCreatedSubscriber,
  ],
})
export class BankingPlaidModule {}