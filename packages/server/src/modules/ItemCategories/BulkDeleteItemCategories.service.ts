import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';

@Injectable()
export class BulkDeleteItemCategoriesService {
  constructor(
    private readonly deleteItemCategoryService: DeleteItemCategoryService,
  ) { }

  async bulkDeleteItemCategories(
    itemCategoryIds: number | Array<number>,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const categoriesIds = uniq(castArray(itemCategoryIds));

    const results = await PromisePool.withConcurrency(1)
      .for(categoriesIds)
      .process(async (itemCategoryId: number) => {
        await this.deleteItemCategoryService.deleteItemCategory(itemCategoryId);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

