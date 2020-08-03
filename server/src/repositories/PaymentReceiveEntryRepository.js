import { omit } from 'lodash';
import BaseModelRepository from '@/repositories/BaseModelRepository';
import { PaymentReceiveEntry } from '@/models';

export default class PaymentReceiveEntryRepository extends BaseModelRepository {
  /**
   * Insert payment receive entries in bulk. 
   * @param {Array} entries 
   * @param {Integr} paymentReceiveId 
   * @return {Promise}
   */
  static insertBulk(entries, paymentReceiveId) {
    const opers = [];
    entries.forEach((entry) => {
      const insertOper = PaymentReceiveEntry.tenant()
        .query()
        .insert({
          payment_receive_id: paymentReceiveId,
          ...entry,
        });
      opers.push(insertOper);
    });
    return Promise.all(opers);
  }

  /**
   * Update payment receive entries in bulk.
   * @param {Array} entries 
   * @return {Promise}
   */
  static updateBulk(entries) {
    const opers = [];
    entries.forEach((entry) => {
      const updateOper = PaymentReceiveEntry.tenant()
        .query()
        .patchAndFetchById(entry.id, {
          ...omit(entry, ['id', 'index']),
        });
      opers.push(updateOper);
    });
    return Promise.all(opers);
  }

  /**
   * Deletes the given payment receive entries ids in bulk.
   * @param {Array} entriesIds 
   * @return {Promise}
   */
  static deleteBulk(entriesIds) {
    return PaymentReceiveEntry.tenant()
      .query()
      .whereIn('id', entriesIds)
      .delete();
  }
}