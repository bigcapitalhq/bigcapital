import { Injectable } from '@nestjs/common';


@Injectable()
export class InventoryValuationSheetRepository {
  asyncInit() {
    const inventoryItems = await Item.query().onBuild((q) => {
      q.where('type', 'inventory');

      if (filter.itemsIds.length > 0) {
        q.whereIn('id', filter.itemsIds);
      }
    });
    const inventoryItemsIds = inventoryItems.map((item) => item.id);

    const commonQuery = (builder) => {
      builder.whereIn('item_id', inventoryItemsIds);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');
      builder.select('itemId');
      builder.groupBy('itemId');

      if (!isEmpty(query.branchesIds)) {
        builder.modify('filterByBranches', query.branchesIds);
      }
      if (!isEmpty(query.warehousesIds)) {
        builder.modify('filterByWarehouses', query.warehousesIds);
      }
    };
    // Retrieve the inventory cost `IN` transactions.
    const INTransactions = await InventoryCostLotTracker.query()
      .onBuild(commonQuery)
      .where('direction', 'IN');

    // Retrieve the inventory cost `OUT` transactions.
    const OUTTransactions = await InventoryCostLotTracker.query()
      .onBuild(commonQuery)
      .where('direction', 'OUT');

    
  }
}
