import { Inject, Injectable } from '@nestjs/common';
import { Warehouse } from '../models/Warehouse.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetWarehouses {
  constructor(
    @Inject(Warehouse.name)
    private readonly warehouseModel: TenantModelProxy<typeof Warehouse>,
  ) {}

  /**
   * Retrieves warehouses list.
   * @returns
   */
  public getWarehouses = async () => {
    const warehouses = await this.warehouseModel()
      .query()
      .orderBy('name', 'DESC');

    return warehouses;
  };
}
