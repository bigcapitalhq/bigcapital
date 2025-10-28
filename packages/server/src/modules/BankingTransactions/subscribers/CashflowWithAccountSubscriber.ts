import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

import { ValidateDeleteBankAccountTransactions } from '../commands/ValidateDeleteBankAccountTransactions.service';
import { OnEvent } from '@nestjs/event-emitter';
import { IAccountEventDeletePayload } from '@/interfaces/Account';

@Injectable()
export class CashflowWithAccountSubscriber {
  constructor(
    private readonly validateDeleteBankAccount: ValidateDeleteBankAccountTransactions,
  ) {}

  /**
   * Validate chart account has no associated cashflow transactions on delete.
   * @param {IAccountEventDeletePayload} payload -
   */
  @OnEvent(events.accounts.onDelete)
  public async validateAccountHasNoCashflowTransactionsOnDelete({
    oldAccount,
  }: IAccountEventDeletePayload) {
    await this.validateDeleteBankAccount.validateAccountHasNoCashflowEntries(
      oldAccount.id
    );
  };
}
