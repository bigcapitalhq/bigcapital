import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CreateWarehouse } from './CreateWarehouse';

@Service()
export class CreateInitialWarehouse {
  @Inject()
  private createWarehouse: CreateWarehouse;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Creates a initial warehouse.
   * @param {number} tenantId
   */
  public createInitialWarehouse = async (tenantId: number) => {
    const { __ } = this.tenancy.i18n(tenantId);

    return this.createWarehouse.createWarehouse(tenantId, {
      name: __('warehouses.primary_warehouse'),
      code: '10001',
      primary: true,
    });
  };
}
