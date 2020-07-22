import { omit, difference } from 'lodash';
import { SaleEstimate, SaleEstimateEntry } from '@/models';

export default class SaleEstimateService {
  constructor() {}

  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {IEstimate} estimate
   * @return {void}
   */
  static async createEstimate(estimate) {
    const storedEstimate = await SaleEstimate.tenant()
      .query()
      .insert({
        ...omit(estimate, ['entries']),
      });
    const storeEstimateEntriesOpers = [];

    estimate.entries.forEach((entry) => {
      const oper = SaleEstimateEntry.tenant()
        .query()
        .insert({
          estimate_id: storedEstimate.id,
          ...entry,
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
    await SaleEstimateEntry.tenant()
      .query()
      .where('estimate_id', estimateId)
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
    const updatedEstimate = await SaleEstimate.tenant()
      .query()
      .update({
        ...omit(estimate, ['entries']),
      });
    const storedEstimateEntries = await SaleEstimateEntry.tenant()
      .query()
      .where('estimate_id', estimateId);

    const opers = [];
    const storedEstimateEntriesIds = storedEstimateEntries.map((e) => e.id);
    const estimateEntriesHasID = estimate.entries.filter((entry) => entry.id);
    const formEstimateEntriesIds = estimateEntriesHasID.map(
      (entry) => entry.id
    );
    const entriesIdsShouldBeDeleted = difference(
      storedEstimateEntriesIds,
      formEstimateEntriesIds,
    );

    console.log(entriesIdsShouldBeDeleted);
    if (entriesIdsShouldBeDeleted.length > 0) {
      const oper = SaleEstimateEntry.tenant()
        .query()
        .where('id', entriesIdsShouldBeDeleted)
        .delete();
      opers.push(oper);
    }
    estimateEntriesHasID.forEach((entry) => {
      const oper = SaleEstimateEntry.tenant()
        .query()
        .patchAndFetchById(entry.id, {
          ...omit(entry, ['id']),
        });
      opers.push(oper);
    });
    await Promise.all([...opers]);
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

    const estimateEntries = await SaleEstimateEntry.tenant()
      .query()
      .whereIn('id', estimateEntriesIds)
      .where('estimate_id', estimateId);

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
