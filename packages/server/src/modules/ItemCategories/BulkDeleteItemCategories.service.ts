import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';

@Injectable()
export class BulkDeleteItemCategoriesService {
  constructor(
    private readonly deleteItemCategoryService: DeleteItemCategoryService,
  ) {}

  async bulkDeleteItemCategories(
    itemCategoryIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const categoriesIds = uniq(castArray(itemCategoryIds));

    const results = await PromisePool.withConcurrency(1)
      .for(categoriesIds)
      .process(async (itemCategoryId: number) => {
        try {
          await this.deleteItemCategoryService.deleteItemCategory(
            itemCategoryId,
            trx,
          );
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
