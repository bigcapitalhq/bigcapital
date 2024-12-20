import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehousesSettings {
  /**
   * Marks multi-warehouses as activated.
   */
  public markMutliwarehoussAsActivated = () => {
    // const settings = this.tenancy.settings(tenantId);

    // settings.set({ group: 'features', key: Features.WAREHOUSES, value: 1 });
  };

  /**
   * Detarmines multi-warehouses is active.
   * @param {number} tenantId
   * @returns {boolean}
   */
  public isMultiWarehousesActive = () => {
    // const settings = this.tenancy.settings(tenantId);

    // return settings.get({ group: 'features', key: Features.WAREHOUSES });
    return true;
  };
}
