import { Inject, Injectable } from '@nestjs/common';
import { SettingsStore } from '../Settings/SettingsStore';
import { SETTINGS_PROVIDER } from '../Settings/Settings.types';
import {
  ITEM_SKU_ENABLED_SETTING,
  ITEM_SKU_REQUIRED_SETTING,
} from './Items.constants';

export interface IItemsSkuSettings {
  enabled: boolean;
  required: boolean;
}

@Injectable()
export class ItemsSettingsService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  /**
   * Retrieves the item SKU settings. The requirement only applies when the
   * SKU feature itself is enabled.
   * @returns {Promise<IItemsSkuSettings>}
   */
  public async getSkuSettings(): Promise<IItemsSkuSettings> {
    const settingsStore = await this.settingsStore();
    const enabled = Boolean(
      settingsStore.get(
        { group: 'items', key: ITEM_SKU_ENABLED_SETTING },
        false,
      ),
    );

    return {
      enabled,
      required:
        enabled &&
        Boolean(
          settingsStore.get(
            { group: 'items', key: ITEM_SKU_REQUIRED_SETTING },
            false,
          ),
        ),
    };
  }
}
