import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class ActivateItem {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Activates the given item on the storage.
   * @param {number} tenantId -
   * @param {number} itemId -
   * @return {Promise<void>}
   */
  public async activateItem(tenantId: number, itemId: number): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);

    // Retreives the given item or throw not found error.
    const oldItem = await Item.query().findById(itemId).throwIfNotFound();

    // Activate the given item with associated transactions under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Mutate item on the storage.
      await Item.query(trx).findById(itemId).patch({ active: true });

      // Triggers `onItemActivated` event.
      await this.eventPublisher.emitAsync(events.item.onActivated, {});
    });
  }
}
