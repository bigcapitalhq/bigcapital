import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteItemService } from './DeleteItem.service';
import { ModelHasRelationsError } from '@/common/exceptions/ModelHasRelations.exception';

@Injectable()
export class ValidateBulkDeleteItemsService {
  constructor(
    private readonly deleteItemService: DeleteItemService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  /**
   * Validates which items from the provided IDs can be deleted.
   * Uses the actual deleteItem service to validate, ensuring the same validation logic.
   * Uses a transaction that is always rolled back to ensure no database changes.
   * @param {number[]} itemIds - Array of item IDs to validate
   * @returns {Promise<{deletableCount: number, nonDeletableCount: number, deletableIds: number[], nonDeletableIds: number[]}>}
   */
  public async validateBulkDeleteItems(itemIds: number[]): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    // Create a transaction that will be rolled back
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });

    try {
      const deletableIds: number[] = [];
      const nonDeletableIds: number[] = [];

      // Check each item to see if it can be deleted by attempting deletion in transaction
      for (const itemId of itemIds) {
        try {
          // Attempt to delete the item using the deleteItem service with the transaction
          // This will use the exact same validation logic as the actual delete
          await this.deleteItemService.deleteItem(itemId, trx);

          // If deletion succeeds, item is deletable
          deletableIds.push(itemId);
        } catch (error) {
          // If error occurs, check the type of error
          if (error instanceof ModelHasRelationsError) {
            // Item has associated transactions/relations, cannot be deleted
            nonDeletableIds.push(itemId);
          } else {
            // Other errors (e.g., item not found), also mark as non-deletable
            nonDeletableIds.push(itemId);
          }
        }
      }

      // Always rollback the transaction to ensure no changes are persisted
      await trx.rollback();

      return {
        deletableCount: deletableIds.length,
        nonDeletableCount: nonDeletableIds.length,
        deletableIds,
        nonDeletableIds,
      };
    } catch (error) {
      // Rollback in case of any error
      await trx.rollback();
      throw error;
    }
  }
}

