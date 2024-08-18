import { Inject, Service } from 'typedi';
import { IAccountEventDeletedPayload } from '@/interfaces';
import { PlaidClientWrapper } from '@/lib/Plaid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';

@Service()
export class DisconnectPlaidItemOnAccountDeleted {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.accounts.onDeleted,
      this.handleDisconnectPlaidItemOnAccountDelete.bind(this)
    );
  }

  /**
   * Deletes Plaid item from the system and Plaid once the account deleted.
   * @param {IAccountEventDeletedPayload} payload
   * @returns {Promise<void>}
   */
  private async handleDisconnectPlaidItemOnAccountDelete({
    tenantId,
    oldAccount,
    trx,
  }: IAccountEventDeletedPayload) {
    const { PlaidItem, Account } = this.tenancy.models(tenantId);

    // Can't continue if the deleted account is not linked to Plaid item.
    if (!oldAccount.plaidItemId) return;

    // Retrieves the Plaid item that associated to the deleted account.
    const oldPlaidItem = await PlaidItem.query(trx).findOne(
      'plaidItemId',
      oldAccount.plaidItemId
    );
    // Unlink the Plaid item from all account before deleting it.
    await Account.query(trx)
      .where('plaidItemId', oldAccount.plaidItemId)
      .patch({
        plaidAccountId: null,
        plaidItemId: null,
      });
    // Remove the Plaid item from the system.
    await PlaidItem.query(trx)
      .findOne('plaidItemId', oldAccount.plaidItemId)
      .delete();

    // Remove Plaid item once the transaction resolve.
    if (oldPlaidItem) {
      const plaidInstance = PlaidClientWrapper.getClient();

      // Remove the Plaid item.
      await plaidInstance.itemRemove({
        access_token: oldPlaidItem.plaidAccessToken,
      });
    }
  }
}
