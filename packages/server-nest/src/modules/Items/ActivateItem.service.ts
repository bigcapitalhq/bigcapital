import { Inject, Injectable } from '@nestjs/common';
import { Item } from './models/Item';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { Knex } from 'knex';

@Injectable()
export class ActivateItemService {
  constructor(
    @Inject(Item.name)
    private readonly itemModel: typeof Item,
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
  ) {}

  /**
   * Activates the given item on the storage.
   * @param {number} itemId -
   * @return {Promise<void>}
   */
  public async activateItem(
    itemId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Retrieves the given item or throw not found error.
    const oldItem = await this.itemModel
      .query()
      .findById(itemId)
      .throwIfNotFound();

    // Activate the given item with associated transactions under unit-of-work environment.
    return this.uow.withTransaction(async (trx) => {
      // Mutate item on the storage.
      await this.itemModel.query(trx).findById(itemId).patch({ active: true });

      // Triggers `onItemActivated` event.
      await this.eventEmitter.emitAsync(events.item.onActivated, {});
    }, trx);
  }
}
