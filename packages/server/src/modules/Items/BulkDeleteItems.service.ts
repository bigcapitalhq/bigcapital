import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteItemService } from './DeleteItem.service';

@Injectable()
export class BulkDeleteItemsService {
  constructor(private readonly deleteItemService: DeleteItemService) { }

  /**
   * Deletes multiple items.
   * @param {number | Array<number>} itemIds - The item id or ids.
   * @param {Knex.Transaction} trx - The transaction.
   */
  async bulkDeleteItems(
    itemIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const itemsIds = uniq(castArray(itemIds));

    const results = await PromisePool.withConcurrency(1)
      .for(itemsIds)
      .process(async (itemId: number) => {
        try {
          await this.deleteItemService.deleteItem(itemId, trx);
        } catch (error) {
          if (!skipUndeletable) {
            throw error;
          }
        }
      });

    if (!skipUndeletable && results.errors && results.errors.length > 0) {
      throw results.errors[0].raw ?? results.errors[0];
    }
  }
}

