import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { IAccountEventDeletedPayload } from '@/interfaces/Account';
import { events } from '@/common/events/events';
import { UnlinkPlaidAccountService } from '@/modules/BankingPlaid/command/UnlinkPlaidAccount.service';

@Injectable()
export class DisconnectPlaidItemOnAccountDeleted {
  constructor(private unlinkPlaidAccount: UnlinkPlaidAccountService) {}

  /**
   * Stops the Plaid feed of the deleted account. The Plaid item is deleted and
   * removed from Plaid with its last account only.
   * @param {IAccountEventDeletedPayload} payload
   * @returns {Promise<void>}
   */
  @OnEvent(events.accounts.onDeleted)
  public async handleDisconnectPlaidItemOnAccountDelete({
    oldAccount,
    trx,
  }: IAccountEventDeletedPayload) {
    // Can't continue if the deleted account is not linked to Plaid item.
    if (!oldAccount.plaidItemId) return;

    await this.unlinkPlaidAccount.unlinkAccount(oldAccount, trx);
  }
}
