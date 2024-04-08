import TenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { parseBoolean, transactionIncrement } from '../../utils';

/**
 * Auto increment orders service.
 */
@Service()
export default class AutoIncrementOrdersService {
  @Inject()
  tenancy: TenancyService;

  autoIncrementEnabled = (tenantId: number, settingsGroup: string): boolean => {
    const settings = this.tenancy.settings(tenantId);
    const group = settingsGroup;

    // Settings service transaction number and prefix.
    const autoIncrement = settings.get({ group, key: 'auto_increment' }, false);

    return parseBoolean(autoIncrement, false);
  };

  /**
   * Retrieve the next service transaction number.
   * @param {number} tenantId
   * @param {string} settingsGroup
   * @param {Function} getMaxTransactionNo
   * @return {Promise<string>}
   */
  getNextTransactionNumber(tenantId: number, settingsGroup: string): string {
    const settings = this.tenancy.settings(tenantId);
    const group = settingsGroup;

    // Settings service transaction number and prefix.
    const autoIncrement = settings.get({ group, key: 'auto_increment' }, false);

    const settingNo = settings.get({ group, key: 'next_number' }, '');
    const settingPrefix = settings.get({ group, key: 'number_prefix' }, '');

    return parseBoolean(autoIncrement, false) ? `${settingPrefix}${settingNo}` : '';
  }

  /**
   * Increment setting next number.
   * @param {number} tenantId -
   * @param {string} orderGroup - Order group.
   * @param {string} orderNumber -Order number.
   */
  async incrementSettingsNextNumber(tenantId: number, group: string) {
    const settings = this.tenancy.settings(tenantId);

    const settingNo = settings.get({ group, key: 'next_number' });
    const autoIncrement = settings.get({ group, key: 'auto_increment' });

    // Can't continue if the auto-increment of the service was disabled.
    if (!autoIncrement) {
      return;
    }

    settings.set({ group, key: 'next_number' }, transactionIncrement(settingNo));
    await settings.save();
  }
}
