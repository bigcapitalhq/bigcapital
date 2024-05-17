import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { transactionIncrement, parseBoolean } from 'utils';

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
    return settings.get({ group, key: 'auto_increment' }, false);
  };

  /**
   * Retrieve the next service transaction number.
   * @param {number} tenantId
   * @param {string} settingsGroup
   * @param {Function} getMaxTransactionNo
   * @return {Promise<string>}
   */
  getNextTransactionNumber(tenantId: number, group: string): string {
    const settings = this.tenancy.settings(tenantId);

    // Settings service transaction number and prefix.
    const autoIncrement = this.autoIncrementEnabled(tenantId, group);

    const settingNo = settings.get({ group, key: 'next_number' }, '');
    const settingPrefix = settings.get({ group, key: 'number_prefix' }, '');

    return autoIncrement ? `${settingPrefix}${settingNo}` : '';
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

    settings.set(
      { group, key: 'next_number' },
      transactionIncrement(settingNo)
    );
    await settings.save();
  }
}
