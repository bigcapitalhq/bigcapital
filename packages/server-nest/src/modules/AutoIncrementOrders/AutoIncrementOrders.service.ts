import { Injectable } from '@nestjs/common';

/**
 * Auto increment orders service.
 */
@Injectable()
export class AutoIncrementOrdersService {
  /**
   * Check if the auto increment is enabled for the given settings group.
   * @param {string} settingsGroup - Settings group.
   * @returns {boolean}
   */
  public autoIncrementEnabled = (settingsGroup: string): boolean => {
    // const settings = this.tenancy.settings(tenantId);
    // const group = settingsGroup;

    // // Settings service transaction number and prefix.
    // return settings.get({ group, key: 'auto_increment' }, false);

    return true;
  };

  /**
   * Retrieve the next service transaction number.
   * @param {string} settingsGroup
   * @param {Function} getMaxTransactionNo
   * @return {Promise<string>}
   */
  getNextTransactionNumber(group: string): string {
    // const settings = this.tenancy.settings(tenantId);

    // // Settings service transaction number and prefix.
    // const autoIncrement = this.autoIncrementEnabled(tenantId, group);

    // const settingNo = settings.get({ group, key: 'next_number' }, '');
    // const settingPrefix = settings.get({ group, key: 'number_prefix' }, '');

    // return autoIncrement ? `${settingPrefix}${settingNo}` : '';

    return '1';
  }

  /**
   * Increment setting next number.
   * @param {string} orderGroup - Order group.
   * @param {string} orderNumber -Order number.
   */
  async incrementSettingsNextNumber(group: string) {
    // const settings = this.tenancy.settings(tenantId);
    // const settingNo = settings.get({ group, key: 'next_number' });
    // const autoIncrement = settings.get({ group, key: 'auto_increment' });
    // // Can't continue if the auto-increment of the service was disabled.
    // if (!autoIncrement) {
    //   return;
    // }
    // settings.set(
    //   { group, key: 'next_number' },
    //   transactionIncrement(settingNo)
    // );
    // await settings.save();
  }
}
