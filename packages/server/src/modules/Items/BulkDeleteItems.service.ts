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
    trx?: Knex.Transaction,
  ): Promise<void> {
    const itemsIds = uniq(castArray(itemIds));

    // Use PromisePool to delete items sequentially (concurrency: 1)
    // to avoid potential database locks and maintain transaction integrity
    const results = await PromisePool.withConcurrency(1)
      .for(itemsIds)
      .process(async (itemId: number) => {
        await this.deleteItemService.deleteItem(itemId, trx);
      });

    // Check if there were any errors
    if (results.errors && results.errors.length > 0) {
      // If needed, you can throw an error here or handle errors individually
      // For now, we'll let individual errors bubble up
      throw results.errors[0].raw;
    }
  }
}

