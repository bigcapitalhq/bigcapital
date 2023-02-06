import { difference, omit } from 'lodash';
import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ItemEntry } from 'models';

@Service()
export default class HasItemEntries {
  @Inject()
  tenancy: TenancyService;

  filterNonInventoryEntries(entries: [], items: []) {
    const nonInventoryItems = items.filter((item: any) => item.type !== 'inventory');
    const nonInventoryItemsIds = nonInventoryItems.map((i: any) => i.id);

    return entries
      .filter((entry: any) => (
        (nonInventoryItemsIds.indexOf(entry.item_id)) !== -1
      ));
  }
  
  filterInventoryEntries(entries: [], items: []) {
    const inventoryItems = items.filter((item: any) => item.type === 'inventory');
    const inventoryItemsIds = inventoryItems.map((i: any) => i.id);

    return entries
      .filter((entry: any) => (
        (inventoryItemsIds.indexOf(entry.item_id)) !== -1
      ));
  }
}