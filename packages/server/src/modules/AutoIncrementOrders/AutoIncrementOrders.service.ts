import { Inject, Injectable } from '@nestjs/common';
import { SettingsStore } from '../Settings/SettingsStore';
import { SETTINGS_PROVIDER } from '../Settings/Settings.types';
import { transactionIncrement } from '@/utils/transaction-increment';

/**
 * Auto increment orders service.
 */
@Injectable()
export class AutoIncrementOrdersService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  /**
   * Check if the auto increment is enabled for the given settings group.
   * @param {string} settingsGroup - Settings group.
   * @returns {Promise<boolean>}
   */
  public autoIncrementEnabled = async (
    settingsGroup: string,
  ): Promise<boolean> => {
    const settingsStore = await this.settingsStore();
    const group = settingsGroup;

    // Settings service transaction number and prefix.
    return settingsStore.get({ group, key: 'auto_increment' }, false);
  };

  /**
   * Retrieve the next service transaction number.
   * @param {string} settingsGroup
   * @param {Function} getMaxTransactionNo
   * @return {Promise<string>}
   */
  async getNextTransactionNumber(group: string): Promise<string> {
    const settingsStore = await this.settingsStore();

    // Settings service transaction number and prefix.
    const autoIncrement = await this.autoIncrementEnabled(group);

    const settingNo = settingsStore.get({ group, key: 'next_number' }, '');
    const settingPrefix = settingsStore.get(
      { group, key: 'number_prefix' },
      '',
    );
    return autoIncrement ? `${settingPrefix}${settingNo}` : '';
  }

  /**
   * Increment setting next number.
   * @param {string} orderGroup - Order group.
   * @param {string} orderNumber -Order number.
   */
  async incrementSettingsNextNumber(group: string) {
    const settingsStore = await this.settingsStore();

    const settingNo = settingsStore.get({ group, key: 'next_number' });
    const autoIncrement = settingsStore.get({ group, key: 'auto_increment' });

    // // Can't continue if the auto-increment of the service was disabled.
    if (!autoIncrement) {
      return;
    }
    settingsStore.set(
      { group, key: 'next_number' },
      transactionIncrement(settingNo),
    );
    await settingsStore.save();
  }
}
