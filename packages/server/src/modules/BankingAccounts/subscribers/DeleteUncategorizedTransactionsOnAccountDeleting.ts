import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IAccountEventDeletePayload } from '@/interfaces/Account';
import { RevertRecognizedTransactionsService } from '@/modules/BankingTranasctionsRegonize/commands/RevertRecognizedTransactions.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { DeleteBankRulesService } from '@/modules/BankRules/commands/DeleteBankRules.service';
import { BankRule } from '@/modules/BankRules/models/BankRule';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteUncategorizedTransactionsOnAccountDeleting {
  constructor(
    private readonly deleteBankRules: DeleteBankRulesService,
    private readonly revertRecognizedTransactins: RevertRecognizedTransactionsService,

    @Inject(BankRule.name)
    private bankRuleModel: TenantModelProxy<typeof BankRule>,

    @Inject(UncategorizedBankTransaction.name)
    private uncategorizedCashflowTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

  /**
   * Handles revert the recognized transactions and delete all the bank rules
   * associated to the deleted bank account.
   * @param {IAccountEventDeletePayload}
   */
  @OnEvent(events.accounts.onDelete)
  public async handleDeleteBankRulesOnAccountDeleting({
    oldAccount,
    trx,
  }: IAccountEventDeletePayload) {
    const foundAssociatedRules = await this.bankRuleModel()
      .query(trx)
      .where('applyIfAccountId', oldAccount.id);
    const foundAssociatedRulesIds = foundAssociatedRules.map((rule) => rule.id);

    // Revert the recognized transactions of the given bank rules.
    await this.revertRecognizedTransactins.revertRecognizedTransactions(
      foundAssociatedRulesIds,
      null,
      trx,
    );
    // Delete the associated uncategorized transactions.
    await this.uncategorizedCashflowTransactionModel()
      .query(trx)
      .where('accountId', oldAccount.id)
      .delete();

    // Delete the given bank rules.
    await this.deleteBankRules.deleteBankRules(foundAssociatedRulesIds, trx);
  }
}
