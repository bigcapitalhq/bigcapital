import { chain, difference } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from './constants';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Warehouse } from '../models/Warehouse.model';

@Injectable()
export class ValidateWarehouseExistance {
  /**
   * @param {TenantModelProxy<typeof Warehouse>} warehouseModel - Warehouse model.
   */
  constructor(
    @Inject(Warehouse.name)
    private readonly warehouseModel: TenantModelProxy<typeof Warehouse>,
  ) {}

  /**
   * Validate transaction warehouse id existance.
   * @param transDTO
   * @param entries
   */
  public validateWarehouseIdExistance = (
    transDTO: { warehouseId?: number },
    entries: { warehouseId?: number }[] = [],
  ) => {
    const notAssignedWarehouseEntries = entries.filter((e) => !e.warehouseId);

    if (notAssignedWarehouseEntries.length > 0 && !transDTO.warehouseId) {
      throw new ServiceError(ERRORS.WAREHOUSE_ID_NOT_FOUND);
    }
    if (entries.length === 0 && !transDTO.warehouseId) {
      throw new ServiceError(ERRORS.WAREHOUSE_ID_NOT_FOUND);
    }
  };

  /**
   * Validate warehouse existance.
   * @param {number} warehouseId - Warehouse id.
   */
  public validateWarehouseExistance = (warehouseId: number) => {
    const warehouse = this.warehouseModel().query().findById(warehouseId);

    if (!warehouse) {
      throw new ServiceError(ERRORS.WAREHOUSE_ID_NOT_FOUND);
    }
  };

  /**
   * Validate item entries warehouses existance.
   * @param {{ warehouseId?: number }[]} entries
   */
  public validateItemEntriesWarehousesExistance = async (
    entries: { warehouseId?: number }[],
  ) => {
    const entriesWarehousesIds = chain(entries)
      .filter((e) => !!e.warehouseId)
      .map((e) => e.warehouseId)
      .uniq()
      .value();

    const warehouses = await this.warehouseModel()
      .query()
      .whereIn('id', entriesWarehousesIds);
    const warehousesIds = warehouses.map((e) => e.id);
    const notFoundWarehousesIds = difference(
      entriesWarehousesIds,
      warehousesIds,
    );
    if (notFoundWarehousesIds.length > 0) {
      throw new ServiceError(ERRORS.WAREHOUSE_ID_NOT_FOUND);
    }
  };
}
