import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { DynamicListService } from '../DynamicListing/DynamicList.service';
import { Item } from './models/Item';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { IItemsFilter } from './types/Items.types';
import { ItemTransformer } from './Item.transformer';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { ISortOrder } from '../DynamicListing/DynamicFilter/DynamicFilter.types';
import { GetItemsQueryDto } from './dtos/GetItemsQuery.dto';
import { raw } from 'objection';

@Injectable()
export class GetItemsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  private async attachQuantityOnHand(items: Item[]): Promise<void> {
    const inventoryItems = items.filter((i) => i.type === 'inventory');
    if (inventoryItems.length === 0) return;

    const ids = inventoryItems.map((i) => i.id);
    const rows: any[] = await this.inventoryTransactionModel()
      .query()
      .whereIn('itemId', ids)
      .select('itemId')
      .select(
        raw("COALESCE(SUM(CASE WHEN direction = 'IN' THEN quantity WHEN direction = 'OUT' THEN -quantity ELSE 0 END), 0) as quantityOnHand"),
      )
      .groupBy('itemId');

    const map = new Map<number, number>();
    rows.forEach((r) => map.set(Number(r.itemId), Number(r.quantityOnHand)));

    inventoryItems.forEach((item) => {
      (item as any).quantityOnHand = map.get(item.id) ?? 0;
    });
  }

  /**
   * Parses items list filter DTO.
   * @param {} filterDTO - Filter DTO.
   */
  private parseItemsListFilterDTO(filterDTO: IItemsFilter) {
    return R.compose(
      this.dynamicListService.parseStringifiedFilter<IItemsFilter>,
    )(filterDTO);
  }

  /**
   * Retrieves items datatable list.
   * @param {IItemsFilter} itemsFilter - Items filter.
   */
  public async getItems(filterDto: Partial<GetItemsQueryDto>) {
    const _filterDto = {
      sortOrder: ISortOrder.DESC,
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      inactiveMode: false,
      ...filterDto,
    };
    // Parses items list filter DTO.
    const filter = this.parseItemsListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      Item,
      filter,
    );
    const { results: items, pagination } = await this.itemModel()
      .query()
      .onBuild((builder) => {
        builder.modify('inactiveMode', filter.inactiveMode);

        builder.withGraphFetched('inventoryAccount');
        builder.withGraphFetched('sellAccount');
        builder.withGraphFetched('costAccount');
        builder.withGraphFetched('category');

        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    await this.attachQuantityOnHand(items as any);

    // Retrieves the transformed items.
    const data = await this.transformer.transform(items, new ItemTransformer());
    return {
      data,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
