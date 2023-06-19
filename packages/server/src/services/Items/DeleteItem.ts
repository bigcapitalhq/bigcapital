import { Service, Inject } from 'typedi';
import {
  IItemEventDeletedPayload,
  IItemEventDeletingPayload,
} from '@/interfaces';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { ERRORS } from './constants';
import { ItemsValidators } from './ItemValidators';

@Service()
export class DeleteItem {
  @Inject()
  private validators: ItemsValidators;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Delete the given item from the storage.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemId - Item id.
   * @return {Promise<void>}
   */
  public async deleteItem(tenantId: number, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);

    // Retrieve the given item or throw not found service error.
    const oldItem = await Item.query()
      .findById(itemId)
      .throwIfNotFound()
      .queryAndThrowIfHasRelations({
        type: ERRORS.ITEM_HAS_ASSOCIATED_TRANSACTIONS,
      });
    // Delete item in unit of work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onItemDeleting` event.
      await this.eventPublisher.emitAsync(events.item.onDeleting, {
        tenantId,
        trx,
        oldItem,
      } as IItemEventDeletingPayload);

      // Deletes the item.
      await Item.query(trx).findById(itemId).delete();

      const eventPayload: IItemEventDeletedPayload = {
        tenantId,
        oldItem,
        itemId,
        trx,
      };
      // Triggers `onItemDeleted` event.
      await this.eventPublisher.emitAsync(events.item.onDeleted, eventPayload);
    });
  }
}
