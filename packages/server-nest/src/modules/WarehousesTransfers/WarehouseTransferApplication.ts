import {
  ICreateWarehouseTransferDTO,
  IEditWarehouseTransferDTO,
  IGetWarehousesTransfersFilterDTO,
} from '@/modules/Warehouses/Warehouse.types';
import { CreateWarehouseTransfer } from './commands/CreateWarehouseTransfer';
import { DeleteWarehouseTransfer } from './commands/DeleteWarehouseTransfer';
import { EditWarehouseTransfer } from './commands/EditWarehouseTransfer';
import { GetWarehouseTransfer } from './queries/GetWarehouseTransfer';
import { GetWarehouseTransfers } from './queries/GetWarehouseTransfers';
import { InitiateWarehouseTransfer } from './commands/InitiateWarehouseTransfer';
import { TransferredWarehouseTransfer } from './commands/TransferredWarehouseTransfer';
import { Injectable } from '@nestjs/common';
import { WarehouseTransfer } from './models/WarehouseTransfer';
import { ModelObject } from 'objection';

@Injectable()
export class WarehouseTransferApplication {
  constructor(
    private readonly createWarehouseTransferService: CreateWarehouseTransfer,
    private readonly editWarehouseTransferService: EditWarehouseTransfer,
    private readonly deleteWarehouseTransferService: DeleteWarehouseTransfer,
    private readonly getWarehouseTransferService: GetWarehouseTransfer,
    private readonly getWarehousesTransfersService: GetWarehouseTransfers,
    private readonly initiateWarehouseTransferService: InitiateWarehouseTransfer,
    private readonly transferredWarehouseTransferService: TransferredWarehouseTransfer,
  ) {}

  /**
   * Creates a warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {ICreateWarehouseTransferDTO} createWarehouseTransferDTO
   * @returns {}
   */
  public createWarehouseTransfer = (
    createWarehouseTransferDTO: ICreateWarehouseTransferDTO,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    return this.createWarehouseTransferService.createWarehouseTransfer(
      createWarehouseTransferDTO,
    );
  };

  /**
   * Edits warehouse transfer transaction.
   * @param {number} tenantId -
   * @param {number} warehouseTransferId - number
   * @param {IEditWarehouseTransferDTO} editWarehouseTransferDTO
   */
  public editWarehouseTransfer = (
    warehouseTransferId: number,
    editWarehouseTransferDTO: IEditWarehouseTransferDTO,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    return this.editWarehouseTransferService.editWarehouseTransfer(
      warehouseTransferId,
      editWarehouseTransferDTO,
    );
  };

  /**
   * Deletes warehouse transfer transaction.
   * @param {number} warehouseTransferId
   * @returns {Promise<void>}
   */
  public deleteWarehouseTransfer = (
    warehouseTransferId: number,
  ): Promise<void> => {
    return this.deleteWarehouseTransferService.deleteWarehouseTransfer(
      warehouseTransferId,
    );
  };

  /**
   * Retrieves warehouse transfer transaction.
   * @param {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public getWarehouseTransfer = (
    warehouseTransferId: number,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    return this.getWarehouseTransferService.getWarehouseTransfer(
      warehouseTransferId,
    );
  };

  /**
   * Retrieves warehouses trans
   * @param {IGetWarehousesTransfersFilterDTO} filterDTO
   * @returns {Promise<IWarehouseTransfer>}
   */
  public getWarehousesTransfers = (
    filterDTO: IGetWarehousesTransfersFilterDTO,
  ) => {
    return this.getWarehousesTransfersService.getWarehouseTransfers(filterDTO);
  };

  /**
   * Marks the warehouse transfer order as transfered.
   * @param {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public transferredWarehouseTransfer = (
    warehouseTransferId: number,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    return this.transferredWarehouseTransferService.transferredWarehouseTransfer(
      warehouseTransferId,
    );
  };

  /**
   * Marks the warehouse transfer order as initiated.
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public initiateWarehouseTransfer = (
    warehouseTransferId: number,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    return this.initiateWarehouseTransferService.initiateWarehouseTransfer(
      warehouseTransferId,
    );
  };
}
