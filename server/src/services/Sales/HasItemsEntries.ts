import { difference, omit } from 'lodash';
import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ItemEntry } from '@/models';

@Service()
export default class HasItemEntries {
  @Inject()
  tenancy: TenancyService;

  /**
   * Patch items entries to the storage.
   *
   * @param {Array} newEntries -
   * @param {Array} oldEntries -
   * @param {String} referenceType -
   * @param {String|Number} referenceId -
   * @return {Promise}
   */
  async patchItemsEntries(
    tenantId: number,
    newEntries: Array<any>,
    oldEntries: Array<any>,
    referenceType: string,
    referenceId: string|number
  ) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const entriesHasIds = newEntries.filter((entry) => entry.id);
    const entriesHasNoIds = newEntries.filter((entry) => !entry.id);
    const entriesIds = entriesHasIds.map(entry => entry.id);

    const oldEntriesIds = oldEntries.map((e) => e.id);
    const excludeAttrs = ['id', 'amount'];
    const opers = [];

    const entriesIdsShouldDelete = difference(
      oldEntriesIds,
      entriesIds,
    );
    if (entriesIdsShouldDelete.length > 0) {
      const deleteOper = ItemEntry.query()
        .whereIn('id', entriesIdsShouldDelete)
        .delete();
      opers.push(deleteOper);
    }
    entriesHasIds.forEach((entry) => {
      const updateOper = ItemEntry.query()
        .where('id', entry.id)
        .update({
          ...omit(entry, excludeAttrs),
        });
      opers.push(updateOper);
    });
    entriesHasNoIds.forEach((entry) => {
      const insertOper = ItemEntry.query()
        .insert({
          reference_id: referenceId,
          reference_type: referenceType,
          ...omit(entry, excludeAttrs),
        });
      opers.push(insertOper);
    });
    return Promise.all([...opers]);
  }

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