
import { ServiceError } from '@/modules/Items/ServiceError';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ERRORS } from '../contants';
import { Warehouse } from '../models/Warehouse.model';

@Injectable()
export class WarehouseValidator {
  constructor(
    @Inject(Warehouse.name)
    private readonly warehouseModel: typeof Warehouse,
  ) {}

  /**
   * Validates the warehouse not only warehouse.
   * @param {number} warehouseId
   */
  public validateWarehouseNotOnlyWarehouse = async (warehouseId: number) => {
    const warehouses = await this.warehouseModel.query().whereNot('id', warehouseId);

    if (warehouses.length === 0) {
      throw new ServiceError(ERRORS.COULD_NOT_DELETE_ONLY_WAERHOUSE);
    }
  };

  /**
   * Validates the warehouse code uniqueness.
   * @param {string} code
   * @param {number} exceptWarehouseId
   */
  public validateWarehouseCodeUnique = async (
    code: string,
    exceptWarehouseId?: number,
  ) => {
    const warehouse = await this.warehouseModel.query()
      .onBuild((query) => {
        query.select(['id']);
        query.where('code', code);

        if (exceptWarehouseId) {
          query.whereNot('id', exceptWarehouseId);
        }
      })
      .first();

    if (warehouse) {
      throw new ServiceError(ERRORS.WAREHOUSE_CODE_NOT_UNIQUE);
    }
  };
}
