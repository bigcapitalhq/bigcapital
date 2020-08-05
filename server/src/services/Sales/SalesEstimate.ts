import { omit, difference, sumBy, mixin } from 'lodash';
import { SaleEstimate, ItemEntry } from '@/models';
import HasItemsEntries from '@/services/Sales/HasItemsEntries';

export default class SaleEstimateService {
  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {IEstimate} estimate
   * @return {void}
   */
  static async createEstimate(estimate: any) {
    const amount = sumBy(estimate.entries, 'amount');
    const storedEstimate = await SaleEstimate.tenant()
      .query()
      .insert({
        amount,
        ...omit(estimate, ['entries']),
      });
    const storeEstimateEntriesOpers: any[] = [];

    estimate.entries.forEach((entry: any) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleEstimate',
          reference_id: storedEstimate.id,
          ...omit(entry, ['total', 'amount', 'id']),
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
  static async deleteEstimate(estimateId: number) {
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
  static async editEstimate(estimateId: number, estimate: any) {
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

    const patchItemsEntries = HasItemsEntries.patchItemsEntries(
      estimate.entries, storedEstimateEntries, 'SaleEstimate', estimateId
    );
    return Promise.all([
      patchItemsEntries,
    ]);
  }

  /**
   * Validates the given estimate ID exists.
   * @async
   * @param {Numeric} estimateId
   * @return {Boolean}
   */
  static async isEstimateExists(estimateId: number) {
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
  static async isEstimateEntriesIDsExists(estimateId: number, estimate: any) {
    const estimateEntriesIds = estimate.entries
      .filter((e) => e.id)
      .map((e) => e.id);

    const estimateEntries = await ItemEntry.tenant()
      .query()
      .whereIn('id', estimateEntriesIds)
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate');

    const storedEstimateEntriesIds = estimateEntries.map((e: any) => e.id);
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
  static async getEstimate(estimateId: number) {
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
  static async getEstimateWithEntries(estimateId: number) {
    const estimate = await SaleEstimate.tenant()
      .query()
      .where('id', estimateId)
      .withGraphFetched('entries')
      .first();

    return estimate;
  }

  /**
   * Detarmines the estimate number uniqness.
   * @param {String} estimateNumber
   * @param {Integer} excludeEstimateId
   * @return {Boolean}
   */
  static async isEstimateNumberUnique(estimateNumber: string, excludeEstimateId: number) {
    const foundEstimates = await SaleEstimate.tenant()
      .query()
      .onBuild((query: any) => {
        query.where('estimate_number', estimateNumber);

        if (excludeEstimateId) {
          query.whereNot('id', excludeEstimateId);
        }
        return query;
      });
    return foundEstimates.length > 0;
  }
}