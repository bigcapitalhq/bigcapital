import { Service, Inject } from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';
import { transactionIncrement } from 'utils';

/**
 * Auto increment orders service.
 */
@Service()
export default class AutoIncrementOrdersService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Retrieve the next service transaction number.
   * @param {number} tenantId
   * @param {string} settingsGroup
   * @param {Function} getMaxTransactionNo
   * @return {Promise<[string, string]>}
   */
  async getNextTransactionNumber(
    tenantId: number,
    settingsGroup: string,
    getOrderTransaction: (prefix: string, number: string) => Promise<boolean>,
    getMaxTransactionNumber: (prefix: string, number: string) => Promise<string>
  ): Promise<[string, string]> {
    const settings = this.tenancy.settings(tenantId);
    const group = settingsGroup;

    // Settings service transaction number and prefix.
    const settingNo = settings.get({ group, key: 'next_number' });
    const settingPrefix = settings.get({ group, key: 'number_prefix' });

    let nextInvoiceNumber = settingNo;

    const orderTransaction = await getOrderTransaction(
      settingPrefix,
      settingNo
    );
    if (orderTransaction) {
      // Retrieve the max invoice number in the given prefix.
      const maxInvoiceNo = await getMaxTransactionNumber(
        settingPrefix,
        settingNo
      );
      if (maxInvoiceNo) {
        nextInvoiceNumber = transactionIncrement(maxInvoiceNo);
      }
    }
    return [settingPrefix, nextInvoiceNumber];
  }

  /**
   * Increment setting next number.
   * @param {number} tenantId -
   * @param {string} orderGroup - Order group.
   * @param {string} orderNumber -Order number.
   */
  async incrementSettingsNextNumber(
    tenantId,
    orderGroup: string,
    orderNumber: string
  ) {
    const settings = this.tenancy.settings(tenantId);

    settings.set(
      { group: orderGroup, key: 'next_number' },
      transactionIncrement(orderNumber)
    );
    await settings.save();
  }
}
