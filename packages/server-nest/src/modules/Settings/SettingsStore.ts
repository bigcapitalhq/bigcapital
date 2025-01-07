import { EntityRepository } from '@/common/repository/EntityRepository';
import { MetableDBStore } from '../Metable/MetableStoreDB';
import { SettingsOptions } from '@/constants/metable-options';

export class SettingsStore extends MetableDBStore {
  /**
   * Constructor method.
   * @param {number} tenantId
   */
  constructor(repository: EntityRepository, config: any = SettingsOptions) {
    super(config);

    // this.setExtraColumns(['group']);
    this.setRepository(repository);
  }
}
