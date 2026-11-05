import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { SimpleFinItem } from '../models/SimpleFinItem';
import { SystemSimpleFinItem } from '../models/SystemSimpleFinItem';
import { ERRORS } from '../constants';

@Injectable()
export class DisconnectSimpleFinItemService {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(SimpleFinItem.name)
    private readonly simplefinItemModel: TenantModelProxy<typeof SimpleFinItem>,

    @Inject(SystemSimpleFinItem.name)
    private readonly systemSimpleFinItemModel: typeof SystemSimpleFinItem,
  ) {}

  /**
   * Unlinks the given bank account from its SimpleFIN item and removes the
   * item once no other account references it.
   * @param {number} bankAccountId
   * @param {string} simplefinItemId
   * @param {Knex.Transaction} trx
   */
  public async unlinkAccount(
    bankAccountId: number,
    simplefinItemId: string,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.accountModel().query(trx).findById(bankAccountId).patch({
      simplefinAccountId: null,
      simplefinItemId: null,
      isFeedsActive: false,
    });
    await this.removeItemIfUnused(simplefinItemId, trx);
  }

  /**
   * Removes the SimpleFIN item when no account is linked to it anymore.
   * SimpleFIN has no server-side revoke endpoint; the user revokes the
   * connection from the SimpleFIN Bridge dashboard.
   * @param {string} simplefinItemId
   * @param {Knex.Transaction} trx
   */
  public async removeItemIfUnused(
    simplefinItemId: string,
    trx?: Knex.Transaction,
  ): Promise<boolean> {
    const linked = await this.accountModel()
      .query(trx)
      .where({ simplefinItemId })
      .resultSize();

    if (linked > 0) return false;

    await this.removeItem(simplefinItemId, trx);
    return true;
  }

  /**
   * Removes an item that has no linked accounts (e.g. the user cancelled the
   * connect dialog after claiming the token).
   * @param {string} simplefinItemId
   */
  public async removeUnlinkedItem(simplefinItemId: string): Promise<void> {
    const item = await this.simplefinItemModel()
      .query()
      .findOne({ simplefinItemId });

    if (!item) {
      throw new ServiceError(ERRORS.SIMPLEFIN_ITEM_NOT_FOUND);
    }
    const removed = await this.removeItemIfUnused(simplefinItemId);

    if (!removed) {
      throw new ServiceError(
        ERRORS.SIMPLEFIN_ITEM_HAS_LINKED_ACCOUNTS,
        'The SimpleFIN connection still has linked accounts. Disconnect them first.',
      );
    }
  }

  /**
   * Deletes the SimpleFIN item from the tenant and system scopes.
   * @param {string} simplefinItemId
   * @param {Knex.Transaction} trx
   */
  private async removeItem(
    simplefinItemId: string,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.simplefinItemModel()
      .query(trx)
      .where({ simplefinItemId })
      .delete();

    await this.systemSimpleFinItemModel
      .query()
      .where({ simplefinItemId })
      .delete();
  }
}
