import { Service, Container, Inject } from 'typedi';
import cryptoRandomString from 'crypto-random-string';
import { Voucher } from "@/system/models";
import { IVoucher } from '@/interfaces';
import VoucherMailMessages from '@/services/Payment/VoucherMailMessages';
import VoucherSMSMessages from '@/services/Payment/VoucherSMSMessages';

@Service()
export default class VoucherService {
  @Inject()
  smsMessages: VoucherSMSMessages;

  @Inject()
  mailMessages: VoucherMailMessages;

  /**
   * Generates the voucher code in the given period.
   * @param {number} voucherPeriod 
   * @return {Promise<IVoucher>}
   */
  async generateVoucher(
    voucherPeriod: number,
    periodInterval: string = 'days',
    planId: number,
  ): IVoucher {
    let voucherCode: string;
    let repeat: boolean = true;

    while(repeat) {
      voucherCode = cryptoRandomString({ length: 10, type: 'numeric' });
      const foundVouchers = await Voucher.query().where('voucher_code', voucherCode);

  		if (foundVouchers.length === 0) {
			  repeat = false;
      }
    }
    return Voucher.query().insert({
      voucherCode, voucherPeriod, periodInterval, planId,
    });
  }

  /**
   * Disables the given voucher id on the storage.
   * @param {number} voucherId 
   * @return {Promise}
   */
  async disableVoucher(voucherId: number) {
    return Voucher.markVoucherAsDisabled(voucherId, 'id');
  }

  /**
   * Deletes the given voucher id from the storage.
   * @param voucherId 
   */
  async deleteVoucher(voucherId: number) {
    return Voucher.query().where('id', voucherId).delete();
  }

  /**
   * Sends voucher code to the given customer via SMS or mail message.
   * @param {string} voucherCode - Voucher code
   * @param {string} phoneNumber - Phone number
   * @param {string} email - Email address.
   */
  async sendVoucherToCustomer(voucherCode: string, phoneNumber: string, email: string) {
    const agenda = Container.get('agenda');

    // Mark the voucher as used.
    await Voucher.markVoucherAsSent(voucherCode);

    if (email) {
      await agenda.schedule('1 second', 'send-voucher-via-email', { voucherCode, email });
    }
    if (phoneNumber) {
      await agenda.schedule('1 second', 'send-voucher-via-phone', { voucherCode, phoneNumber });
    }
  }
}