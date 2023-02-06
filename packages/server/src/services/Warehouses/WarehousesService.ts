import { Service } from 'typedi';

@Service()
export class WarehousesService {
  /**
   *
   * @param {number} tenantId
   * @param {number} warehouseId
   */
  getWarehouse = (tenantId: number, warehouseId: number) => {};

  /**
   *
   * @param {number} tenantId
   */
  getWarehouses = (tenantId: number) => {};

  /**
   *
   * @param {number} tenantId
   * @param {number} warehouseId
   */
  deleteWarehouse = (tenantId: number, warehouseId: number) => {};

  /**
   *
   * @param {number} tenantId
   * @param {number} warehouseId
   * @param {IEditWarehouseDTO} warehouseDTO
   */
  editWarehouse = (
    tenantId: number,
    warehouseId: number,
    warehouseDTO: IEditWarehouseDTO
  ) => {};
}
