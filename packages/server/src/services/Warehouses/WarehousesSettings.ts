import { Features } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class WarehousesSettings {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Marks multi-warehouses as activated.
   */
  public markMutliwarehoussAsActivated = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    settings.set({ group: 'features', key: Features.WAREHOUSES, value: 1 });
  };

  /**
   * Detarmines multi-warehouses is active.
   * @param   {number} tenantId
   * @returns {boolean}
   */
  public isMultiWarehousesActive = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    return settings.get({ group: 'features', key: Features.WAREHOUSES });
  };
}
