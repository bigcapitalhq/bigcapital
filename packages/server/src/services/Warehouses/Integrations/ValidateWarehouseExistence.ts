import { Inject, Service } from 'typedi';
import { chain, difference } from 'lodash';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class ValidateWarehouseExistence {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Validate transaction warehouse id existence.
   * @param transDTO
   * @param entries
   */
  public validateWarehouseIdExistence = (
    transDTO: { warehouseId?: number },
    entries: { warehouseId?: number }[] = []
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
   * Validate warehouse existence.
   * @param {number} tenantId
   * @param {number} warehouseId
   */
  public validateWarehouseExistence = (
    tenantId: number,
    warehouseId: number
  ) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouse = Warehouse.query().findById(warehouseId);

    if (!warehouse) {
      throw new ServiceError(ERRORS.WAREHOUSE_ID_NOT_FOUND);
    }
  };

  /**
   *
   * @param {number} tenantId
   * @param {{ warehouseId?: number }[]} entries
   */
  public validateItemEntriesWarehousesExistence = async (
    tenantId: number,
    entries: { warehouseId?: number }[]
  ) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const entriesWarehousesIds = chain(entries)
      .filter((e) => !!e.warehouseId)
      .map((e) => e.warehouseId)
      .uniq()
      .value();

    const warehouses = await Warehouse.query().whereIn(
      'id',
      entriesWarehousesIds
    );
    const warehousesIds = warehouses.map((e) => e.id);
    const notFoundWarehousesIds = difference(
      entriesWarehousesIds,
      warehousesIds
    );
    if (notFoundWarehousesIds.length > 0) {
      throw new ServiceError(ERRORS.WAREHOUSE_ID_NOT_FOUND);
    }
  };
}
