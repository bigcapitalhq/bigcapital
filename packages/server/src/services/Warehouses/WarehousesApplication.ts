import { ICreateWarehouseDTO, IEditWarehouseDTO, IWarehouse } from '@/interfaces';
import { Inject, Service } from 'typedi';
import { ActivateWarehouses } from './ActivateWarehouses';
import { CreateWarehouse } from './CreateWarehouse';
import { DeleteWarehouse } from './DeleteWarehouse';
import { EditWarehouse } from './EditWarehouse';
import { GetWarehouse } from './GetWarehouse';
import { GetWarehouses } from './GetWarehouses';
import { GetItemWarehouses } from './Items/GetItemWarehouses';
import { WarehouseMarkPrimary } from './WarehouseMarkPrimary';

@Service()
export class WarehousesApplication {
  @Inject()
  private createWarehouseService: CreateWarehouse;

  @Inject()
  private editWarehouseService: EditWarehouse;

  @Inject()
  private deleteWarehouseService: DeleteWarehouse;

  @Inject()
  private getWarehouseService: GetWarehouse;

  @Inject()
  private getWarehousesService: GetWarehouses;

  @Inject()
  private activateWarehousesService: ActivateWarehouses;

  @Inject()
  private markWarehousePrimaryService: WarehouseMarkPrimary;

  @Inject()
  private getItemWarehousesService: GetItemWarehouses;

  /**
   * Creates a new warehouse.
   * @param   {number} tenantId
   * @param   {ICreateWarehouseDTO} createWarehouseDTO
   * @returns
   */
  public createWarehouse = (
    tenantId: number,
    createWarehouseDTO: ICreateWarehouseDTO
  ) => {
    return this.createWarehouseService.createWarehouse(
      tenantId,
      createWarehouseDTO
    );
  };

  /**
   * Edits the given warehouse.
   * @param   {number} tenantId
   * @param   {number} warehouseId
   * @param   {IEditWarehouseDTO} editWarehouseDTO
   * @returns {Promise<void>}
   */
  public editWarehouse = (
    tenantId: number,
    warehouseId: number,
    editWarehouseDTO: IEditWarehouseDTO
  ) => {
    return this.editWarehouseService.editWarehouse(
      tenantId,
      warehouseId,
      editWarehouseDTO
    );
  };

  /**
   * Deletes the given warehouse.
   * @param {number} tenantId
   * @param {number} warehouseId
   */
  public deleteWarehouse = (tenantId: number, warehouseId: number) => {
    return this.deleteWarehouseService.deleteWarehouse(tenantId, warehouseId);
  };

  /**
   * Retrieves the specific warehouse.
   * @param   {number} tenantId
   * @param   {number} warehouseId
   * @returns
   */
  public getWarehouse = (tenantId: number, warehouseId: number) => {
    return this.getWarehouseService.getWarehouse(tenantId, warehouseId);
  };

  /**
   *
   * @param   {number} tenantId
   * @returns
   */
  public getWarehouses = (tenantId: number) => {
    return this.getWarehousesService.getWarehouses(tenantId);
  };

  /**
   * Activates the warehouses feature.
   * @param   {number} tenantId
   * @returns {Promise<void>}
   */
  public activateWarehouses = (tenantId: number) => {
    return this.activateWarehousesService.activateWarehouses(tenantId);
  };

  /**
   * Mark the given warehouse as primary.
   * @param   {number} tenantId -
   * @returns {Promise<IWarehouse>}
   */
  public markWarehousePrimary = (
    tenantId: number,
    warehouseId: number
  ): Promise<IWarehouse> => {
    return this.markWarehousePrimaryService.markAsPrimary(
      tenantId,
      warehouseId
    );
  };

  /**
   * Retrieves the specific item warehouses quantity. 
   * @param {number} tenantId 
   * @param {number} itemId 
   * @returns 
   */
  public getItemWarehouses = (
    tenantId: number,
    itemId: number
  ): Promise<any> => {
    return this.getItemWarehousesService.getItemWarehouses(tenantId, itemId);
  };
}
