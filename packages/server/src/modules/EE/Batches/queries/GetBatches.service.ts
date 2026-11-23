import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Batch } from '../models/Batch';
import { Item } from '@/modules/Items/models/Item';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BatchesBalanceService } from '../BatchesBalance.service';
import { BatchStatus, IGetBatchesFilter } from '../types/Batches.types';
import type {
  IBatchWithBalance,
  IBatchWithTotals,
} from '../types/Batches.types';

export interface IBatchesListResult {
  results: IBatchWithBalance[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface IBatchesListResultWithTotals
  extends Omit<IBatchesListResult, 'results'> {
  results: IBatchWithTotals[];
}

export interface IGetBatchesOptions {
  /**
   * Attaches the quantity in/out calculated from the inventory transactions.
   * Only the batch details report needs them.
   */
  includeTransactionTotals?: boolean;
}

@Injectable()
export class GetBatchesService {
  /**
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {TenantModelProxy<typeof Item>} itemModel
   * @param {BatchesBalanceService} batchesBalance
   */
  constructor(
    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    private readonly batchesBalance: BatchesBalanceService,
  ) {}

  /**
   * Retrieves the batches list with the stored quantity on hand.
   */
  public async getBatches(
    filter?: IGetBatchesFilter,
  ): Promise<IBatchesListResult>;

  /**
   * Retrieves the batches list with the transaction quantity in/out.
   */
  public async getBatches(
    filter: IGetBatchesFilter | undefined,
    options: { includeTransactionTotals: true },
  ): Promise<IBatchesListResultWithTotals>;

  public async getBatches(
    filter: IGetBatchesFilter = {},
    options: IGetBatchesOptions = {},
  ): Promise<IBatchesListResult | IBatchesListResultWithTotals> {
    const query = this.batchModel()
      .query()
      .withGraphFetched('item')
      .orderBy('batches.createdAt', 'DESC')
      .orderBy('batches.id', 'DESC');

    if (filter.itemId) {
      query.where('batches.itemId', filter.itemId);
    }
    if (filter.itemsIds?.length) {
      query.whereIn('batches.itemId', filter.itemsIds);
    }
    if (filter.fromDate) {
      query.where('batches.createdAt', '>=', moment(filter.fromDate).toDate());
    }
    if (filter.toDate) {
      query.where(
        'batches.createdAt',
        '<=',
        moment(filter.toDate).endOf('day').toDate(),
      );
    }
    if (filter.search) {
      const search = `%${filter.search.trim()}%`;
      const matchedItems = await this.itemModel()
        .query()
        .select('id')
        .where('name', 'like', search);

      query.where((builder) => {
        builder
          .where('batches.batchNumber', 'like', search)
          .orWhere('batches.batchRef', 'like', search);

        if (matchedItems.length > 0) {
          builder.orWhereIn(
            'batches.itemId',
            matchedItems.map((item) => item.id),
          );
        }
      });
    }

    const batches = await query;
    const batchesWithBalance = await this.batchesBalance.attachBalance(batches);

    const filteredBatches = filter.status
      ? batchesWithBalance.filter((batch) => batch.status === filter.status)
      : batchesWithBalance;

    const page = Math.max(Number(filter.page) || 1, 1);
    const pageSize = filter.pageSize
      ? Math.max(Number(filter.pageSize), 1)
      : filteredBatches.length;

    const offset = (page - 1) * pageSize;
    const results = pageSize
      ? filteredBatches.slice(offset, offset + pageSize)
      : filteredBatches;

    const pagination = {
      total: filteredBatches.length,
      page,
      pageSize: pageSize || filteredBatches.length,
    };

    if (options.includeTransactionTotals) {
      return {
        results: await this.batchesBalance.attachTransactionTotals(results),
        pagination,
      };
    }
    return { results, pagination };
  }

  /**
   * Retrieves the batches of the given item that still have an available
   * quantity to be consumed, ordered by expiry date (first expiry first out).
   */
  public async getAvailableBatches(
    itemId: number,
  ): Promise<IBatchWithBalance[]> {
    const { results } = await this.getBatches({ itemId });

    return results
      .filter((batch) =>
        [BatchStatus.Active, BatchStatus.ExpiringSoon].includes(batch.status),
      )
      .filter((batch) => batch.quantityOnHand > 0)
      .sort((a, b) => {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return moment(a.expiryDate).diff(moment(b.expiryDate));
      });
  }

  /**
   * Retrieves the batch of the given id with balance.
   */
  public async getBatch(id: number): Promise<IBatchWithBalance | undefined> {
    const batch = await this.batchModel()
      .query()
      .findById(id)
      .withGraphFetched('item');

    if (!batch) {
      return undefined;
    }
    const [batchWithBalance] = await this.batchesBalance.attachBalance([batch]);

    return batchWithBalance;
  }
}
