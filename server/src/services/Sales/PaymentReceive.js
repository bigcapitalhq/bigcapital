import { omit } from 'lodash';
import { PaymentReceive, PaymentReceiveEntry } from '@/models';
import JournalPosterService from '@/services/Sales/JournalPosterService';

export default class PaymentReceiveService extends JournalPosterService {
  /**
   * Creates a new payment receive and store it to the storage
   * with associated invoices payment and journal transactions.
   * @async
   * @param {IPaymentReceive} paymentReceive 
   */
  static async createPaymentReceive(paymentReceive) {
    const storedPaymentReceive = await PaymentReceive.tenant()
      .query()
      .insert({
        ...omit(paymentReceive, ['entries']),
      });
    const storeOpers = [];

    paymentReceive.entries.forEach((invoice) => {
      const oper = PaymentReceiveEntry.tenant().query().insert({
        payment_receive_id: storedPaymentReceive.id,
        ...invoice,
      });
      storeOpers.push(oper);
    });
    await Promise.all([ ...storeOpers ]);

    return storedPaymentReceive;
  }

  /**
   * Edit details the given payment receive with associated entries.
   * @async
   * @param {Integer} paymentReceiveId 
   * @param {IPaymentReceive} paymentReceive 
   */
  static async editPaymentReceive(paymentReceiveId, paymentReceive) {
    const updatePaymentReceive = await PaymentReceive.tenant().query()
      .where('id', paymentReceiveId)
      .update({
        ...omit(paymentReceive, ['entries']),
      });
    const storedEntries = await PaymentReceiveEntry.tenant().query()
      .where('payment_receive_id', paymentReceiveId);
  
    const entriesIds = paymentReceive.entries.filter(i => i.id);    
    const opers = [];

    const entriesIdsShouldDelete = this.entriesShouldDeleted(
      storedEntries,
      entriesIds,
    );
    if (entriesIdsShouldDelete.length > 0) {
      const deleteOper = PaymentReceiveEntry.tenant().query()
        .whereIn('id', entriesIdsShouldDelete)
        .delete();
      opers.push(deleteOper);
    }
    entriesIds.forEach((entry) => {
      const updateOper = PaymentReceiveEntry.tenant()
        .query()
        .pathAndFetchById(entry.id, {
          ...omit(entry, ['id']),
        });
      opers.push(updateOper);
    });
    await Promise.all([...opers]);
  }

  /**
   * Deletes the given payment receive with associated entries 
   * and journal transactions.
   * @param {Integer} paymentReceiveId 
   */
  static async deletePaymentReceive(paymentReceiveId) {
    await PaymentReceive.tenant().query().where('id', paymentReceiveId).delete();
    await PaymentReceiveEntry.tenant().query().where('payment_receive_id', paymentReceiveId).delete();

    await this.deleteJournalTransactions(paymentReceiveId);
  }

  /**
   * Retrieve the payment receive details of the given id.
   * @param {Integer} paymentReceiveId 
   */
  static async getPaymentReceive(paymentReceiveId) {
    const paymentReceive = await PaymentReceive.tenant().query().where('id', paymentReceiveId).first();
    return paymentReceive;
  }

  /**
   * Retrieve the payment receive details with associated invoices.
   * @param {Integer} paymentReceiveId 
   */
  static async getPaymentReceiveWithInvoices(paymentReceiveId) {
    const paymentReceive = await PaymentReceive.tenant().query()
      .where('id', paymentReceiveId)
      .withGraphFetched('invoices')
      .first();
    return paymentReceive;
  }
  
  static async isPaymentReceiveExists(paymentReceiveId) {
    const paymentReceives = await PaymentReceive.tenant().query().where('id', paymentReceiveId)
    return paymentReceives.length > 0;
  }

  /**
   * Detarmines the payment receive number existance.
   */
  static async isPaymentReceiveNoExists(paymentReceiveNumber) {
    const paymentReceives = await PaymentReceive.tenant().query().where('payment_receive_no', paymentReceiveNumber);
    return paymentReceives.length > 0;
  }
}