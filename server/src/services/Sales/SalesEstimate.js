import { omit, difference, sumBy } from 'lodash';
import { SaleEstimate, ItemEntry } from '@/models';
import ServiceItemsEntries from '@/services/Sales/ServiceItemsEntries';

export default class SaleEstimateService extends ServiceItemsEntries {
  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {IEstimate} estimate
   * @return {void}
   */
  static async createEstimate(estimate) {
    const amount = sumBy(estimate.entries, 'amount');
    const storedEstimate = await SaleEstimate.tenant()
      .query()
      .insert({
        amount,
        ...omit(estimate, ['entries']),
      });
    const storeEstimateEntriesOpers = [];

    estimate.entries.forEach((entry) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleEstimate',
          reference_id: storedEstimate.id,
          ...omit(entry, ['total', 'amount']),
        });
      storeEstimateEntriesOpers.push(oper);
    });
    await Promise.all([...storeEstimateEntriesOpers]);

    return storedEstimate;
  }

  /**
   * Deletes the given estimate id with associated entries.
   * @async
   * @param {IEstimate} estimateId
   * @return {void}
   */
  static async deleteEstimate(estimateId) {
    await ItemEntry.tenant()
      .query()
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate')
      .delete();
    await SaleEstimate.tenant().query().where('id', estimateId).delete();
  }

  /**
   * Edit details of the given estimate with associated entries.
   * @async
   * @param {Integer} estimateId
   * @param {IEstimate} estimate
   * @return {void}
   */
  static async editEstimate(estimateId, estimate) {
    const amount = sumBy(estimate.entries, 'amount');
    const updatedEstimate = await SaleEstimate.tenant()
      .query()
      .update({
        amount,
        ...omit(estimate, ['entries']),
      });
    const storedEstimateEntries = await ItemEntry.tenant()
      .query()
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate');

    const opers = [];
    const entriesHasID = estimate.entries.filter((entry) => entry.id);
    const entriesHasNoIDs = estimate.entries.filter((entry) => !entry.id);

    const storedEntriesIds = storedEstimateEntries.map((e) => e.id);
    const formEstimateEntriesIds = entriesHasID.map((entry) => entry.id);

    const entriesIdsShouldBeDeleted = difference(
      storedEntriesIds,
      formEstimateEntriesIds,
    );
    // Deletes the given sale estimate entries ids.
    if (entriesIdsShouldBeDeleted.length > 0) {
      const oper = ItemEntry.tenant()
        .query()
        .whereIn('id', entriesIdsShouldBeDeleted)
        .delete();
      opers.push(oper);
    }
    // Insert the new sale estimate entries.
    entriesHasNoIDs.forEach((entry) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleEstimate',
          reference_id: estimateId,
          ...entry,
        });
      opers.push(oper);
    });
    entriesHasID.forEach((entry) => {
      const oper = ItemEntry.tenant()
        .query()
        .patchAndFetchById(entry.id, {
          ...omit(entry, ['id']),
        });
      opers.push(oper);
    });
    return Promise.all([...opers]);
  }

  /**
   * Validates the given estimate ID exists.
   * @async
   * @param {Numeric} estimateId
   * @return {Boolean}
   */
  static async isEstimateExists(estimateId) {
    const foundEstimate = await SaleEstimate.tenant()
      .query()
      .where('id', estimateId);
    return foundEstimate.length !== 0;
  }

  /**
   * Validates the given estimate entries IDs.
   * @async
   * @param {Numeric} estimateId
   * @param {IEstimate} estimate
   */
  static async isEstimateEntriesIDsExists(estimateId, estimate) {
    const estimateEntriesIds = estimate.entries
      .filter((e) => e.id)
      .map((e) => e.id);

    const estimateEntries = await ItemEntry.tenant()
      .query()
      .whereIn('id', estimateEntriesIds)
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate');

    const storedEstimateEntriesIds = estimateEntries.map((e) => e.id);
    const notFoundEntriesIDs = difference(
      estimateEntriesIds,
      storedEstimateEntriesIds
    );
    return notFoundEntriesIDs;
  }

  /**
   * Retrieve the estimate details of the given estimate id.
   * @param {Integer} estimateId
   * @return {IEstimate}
   */
  static async getEstimate(estimateId) {
    const estimate = await SaleEstimate.tenant()
      .query()
      .where('id', estimateId)
      .first();

    return estimate;
  }

  /**
   * Retrieve the estimate details with associated entries.
   * @param {Integer} estimateId
   */
  static async getEstimateWithEntries(estimateId) {
    const estimate = await SaleEstimate.tenant()
      .query()
      .where('id', estimateId)
      .withGraphFetched('entries')
      .first();

    return estimate;
  }

  /**
   * Detarmines the estimate number uniqness.
   * @param {Integer} estimateNumber
   * @param {Integer} excludeEstimateId
   * @return {Boolean}
   */
  static async isEstimateNumberUnique(estimateNumber, excludeEstimateId) {
    const foundEstimates = await SaleEstimate.tenant()
      .query()
      .onBuild((query) => {
        query.where('estimate_number', estimateNumber);

        if (excludeEstimateId) {
          query.whereNot('id', excludeEstimateId);
        }
        return query;
      });
    return foundEstimates.length > 0;
  }
}
