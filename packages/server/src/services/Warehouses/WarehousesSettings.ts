import { Service, Inject } from 'typedi';
import { Features } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

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
   * Determines multi-warehouses is active.
   * @param   {number} tenantId
   * @returns {boolean}
   */
  public isMultiWarehousesActive = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    return settings.get({ group: 'features', key: Features.WAREHOUSES });
  };
}
