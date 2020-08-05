import { difference, omit } from 'lodash';
import { ItemEntry } from '@/models';

export default class HasItemEntries {
  /**
   * Patch items entries to the storage.
   *
   * @param {Array} newEntries -
   * @param {Array} oldEntries -
   * @param {String} referenceType -
   * @param {String|Number} referenceId -
   *
   * @return {Promise}
   */
  static async patchItemsEntries(newEntries: Array<any>, oldEntries: Array<any>, referenceType: string, referenceId: string|number) {
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
      const deleteOper = ItemEntry.tenant()
        .query()
        .whereIn('id', entriesIdsShouldDelete)
        .delete();
      opers.push(deleteOper);
    }
    entriesHasIds.forEach((entry) => {
      const updateOper = ItemEntry.tenant()
        .query()
        .where('id', entry.id)
        .update({
          ...omit(entry, excludeAttrs),
        });
      opers.push(updateOper);
    });
    entriesHasNoIds.forEach((entry) => {
      const insertOper = ItemEntry.tenant()
        .query()
        .insert({
          reference_id: referenceId,
          reference_type: referenceType,
          ...omit(entry, excludeAttrs),
        });
      opers.push(insertOper);
    });
    return Promise.all([...opers]);
  }
}