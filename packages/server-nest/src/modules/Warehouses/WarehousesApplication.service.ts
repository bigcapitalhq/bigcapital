import {
  ICreateWarehouseDTO,
  IEditWarehouseDTO,
  IWarehouse,
} from './Warehouse.types';
import { ActivateWarehousesService } from './commands/ActivateWarehouses';
import { CreateWarehouse } from './commands/CreateWarehouse.service';
import { DeleteWarehouseService } from './commands/DeleteWarehouse.service';
import { EditWarehouse } from './commands/EditWarehouse.service';
import { GetWarehouse } from './queries/GetWarehouse';
import { GetWarehouses } from './queries/GetWarehouses';
import { GetItemWarehouses } from './Items/GetItemWarehouses';
import { WarehouseMarkPrimary } from './commands/WarehouseMarkPrimary.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehousesApplication {
  constructor(
    private createWarehouseService: CreateWarehouse,
    private editWarehouseService: EditWarehouse,
    private deleteWarehouseService: DeleteWarehouseService,
    private getWarehouseService: GetWarehouse,
    private getWarehousesService: GetWarehouses,
    private activateWarehousesService: ActivateWarehousesService,
    private markWarehousePrimaryService: WarehouseMarkPrimary,
    private getItemWarehousesService: GetItemWarehouses,
  ) {}

  /**
   * Creates a new warehouse.
   * @param {ICreateWarehouseDTO} createWarehouseDTO
   * @returns {Promise<IWarehouse>}
   */
  public createWarehouse = (createWarehouseDTO: ICreateWarehouseDTO) => {
    return this.createWarehouseService.createWarehouse(createWarehouseDTO);
  };

  /**
   * Edits the given warehouse.
   * @param   {number} tenantId
   * @param   {number} warehouseId
   * @param   {IEditWarehouseDTO} editWarehouseDTO
   * @returns {Promise<void>}
   */
  public editWarehouse = (
    warehouseId: number,
    editWarehouseDTO: IEditWarehouseDTO,
  ) => {
    return this.editWarehouseService.editWarehouse(
      warehouseId,
      editWarehouseDTO,
    );
  };

  /**
   * Deletes the given warehouse.
   * @param {number} tenantId
   * @param {number} warehouseId
   */
  public deleteWarehouse = (warehouseId: number) => {
    return this.deleteWarehouseService.deleteWarehouse(warehouseId);
  };

  /**
   * Retrieves the specific warehouse.
   * @param   {number} warehouseId
   * @returns
   */
  public getWarehouse = (warehouseId: number) => {
    return this.getWarehouseService.getWarehouse(warehouseId);
  };

  /**
   *
   * @param   {number} tenantId
   * @returns
   */
  public getWarehouses = () => {
    return this.getWarehousesService.getWarehouses();
  };

  /**
   * Activates the warehouses feature.
   * @returns {Promise<void>}
   */
  public activateWarehouses = () => {
    return this.activateWarehousesService.activateWarehouses();
  };

  /**
   * Mark the given warehouse as primary.
   * @param   {number} tenantId -
   * @returns {Promise<IWarehouse>}
   */
  public markWarehousePrimary = (
    tenantId: number,
    warehouseId: number,
  ): Promise<IWarehouse> => {
    return this.markWarehousePrimaryService.markAsPrimary(warehouseId);
  };

  /**
   * Retrieves the specific item warehouses quantity.
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public getItemWarehouses = (itemId: number): Promise<any> => {
    return this.getItemWarehousesService.getItemWarehouses(itemId);
  };
}
