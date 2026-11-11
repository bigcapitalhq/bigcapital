import { Inject, Injectable } from '@nestjs/common';
import {
  DEFAULT_COST_METHOD,
  parseCostMethod,
  TCostMethod,
} from '@/common/constants/inventory.constants';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';
import { SettingsStore } from '@/modules/Settings/SettingsStore';

export interface IItemCostMethodSource {
  costMethod?: string | null;
  category?: {
    costMethod?: string | null;
  } | null;
}

@Injectable()
export class ItemCostMethodResolverService {
  /**
   * @param {() => SettingsStore} settingsStore - Settings store.
   */
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  /**
   * Retrieves the global default inventory cost method from the preferences.
   * @returns {Promise<TCostMethod>}
   */
  public async getDefaultCostMethod(): Promise<TCostMethod> {
    const settings = await this.settingsStore();
    const value = settings.get({
      group: 'items',
      key: 'default_cost_method',
    });

    return (
      parseCostMethod(value as string | null | undefined) ?? DEFAULT_COST_METHOD
    );
  }

  /**
   * Resolves the effective cost method of the given item following the
   * item -> category -> global preference -> AVG order.
   * @param {IItemCostMethodSource} item - The item source.
   * @param {TCostMethod} defaultMethod - The global default cost method.
   * @returns {TCostMethod}
   */
  public resolveCostMethod(
    item: IItemCostMethodSource,
    defaultMethod: TCostMethod = DEFAULT_COST_METHOD,
  ): TCostMethod {
    return (
      parseCostMethod(item.costMethod) ??
      parseCostMethod(item.category?.costMethod) ??
      parseCostMethod(defaultMethod) ??
      DEFAULT_COST_METHOD
    );
  }

  /**
   * Resolves the effective cost method of the given item using the global
   * default preference.
   * @param {IItemCostMethodSource} item - The item source.
   * @returns {Promise<TCostMethod>}
   */
  public async resolveItemCostMethod(
    item: IItemCostMethodSource,
  ): Promise<TCostMethod> {
    const defaultMethod = await this.getDefaultCostMethod();

    return this.resolveCostMethod(item, defaultMethod);
  }
}
