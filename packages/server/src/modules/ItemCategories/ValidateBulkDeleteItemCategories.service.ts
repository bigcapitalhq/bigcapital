import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';

@Injectable()
export class ValidateBulkDeleteItemCategoriesService {
  constructor(
    private readonly deleteItemCategoryService: DeleteItemCategoryService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  public async validateBulkDeleteItemCategories(itemCategoryIds: number[]): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });

    try {
      const deletableIds: number[] = [];
      const nonDeletableIds: number[] = [];

      for (const itemCategoryId of itemCategoryIds) {
        try {
          await this.deleteItemCategoryService.deleteItemCategory(
            itemCategoryId,
            trx,
          );
          deletableIds.push(itemCategoryId);
        } catch (error) {
          nonDeletableIds.push(itemCategoryId);
        }
      }

      await trx.rollback();

      return {
        deletableCount: deletableIds.length,
        nonDeletableCount: nonDeletableIds.length,
        deletableIds,
        nonDeletableIds,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

