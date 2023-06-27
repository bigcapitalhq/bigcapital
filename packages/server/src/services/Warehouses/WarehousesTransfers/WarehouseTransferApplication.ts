import {
  ICreateWarehouseTransferDTO,
  IEditWarehouseTransferDTO,
  IGetWarehousesTransfersFilterDTO,
  IWarehouseTransfer,
} from '@/interfaces';
import { Service, Inject } from 'typedi';
import { CreateWarehouseTransfer } from './CreateWarehouseTransfer';
import { DeleteWarehouseTransfer } from './DeleteWarehouseTransfer';
import { EditWarehouseTransfer } from './EditWarehouseTransfer';
import { GetWarehouseTransfer } from './GetWarehouseTransfer';
import { GetWarehouseTransfers } from './GetWarehouseTransfers';
import { InitiateWarehouseTransfer } from './InitiateWarehouseTransfer';
import { TransferredWarehouseTransfer } from './TransferredWarehouseTransfer';

@Service()
export class WarehouseTransferApplication {
  @Inject()
  private createWarehouseTransferService: CreateWarehouseTransfer;

  @Inject()
  private editWarehouseTransferService: EditWarehouseTransfer;

  @Inject()
  private deleteWarehouseTransferService: DeleteWarehouseTransfer;

  @Inject()
  private getWarehouseTransferService: GetWarehouseTransfer;

  @Inject()
  private getWarehousesTransfersService: GetWarehouseTransfers;

  @Inject()
  private initiateWarehouseTransferService: InitiateWarehouseTransfer;

  @Inject()
  private transferredWarehouseTransferService: TransferredWarehouseTransfer;

  /**
   * Creates a warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {ICreateWarehouseTransferDTO} createWarehouseTransferDTO
   * @returns {}
   */
  public createWarehouseTransfer = (
    tenantId: number,
    createWarehouseTransferDTO: ICreateWarehouseTransferDTO
  ): Promise<IWarehouseTransfer> => {
    return this.createWarehouseTransferService.createWarehouseTransfer(
      tenantId,
      createWarehouseTransferDTO
    );
  };

  /**
   * Edits warehouse transfer transaction.
   * @param {number} tenantId -
   * @param {number} warehouseTransferId - number
   * @param {IEditWarehouseTransferDTO} editWarehouseTransferDTO
   */
  public editWarehouseTransfer = (
    tenantId: number,
    warehouseTransferId: number,
    editWarehouseTransferDTO: IEditWarehouseTransferDTO
  ): Promise<IWarehouseTransfer> => {
    return this.editWarehouseTransferService.editWarehouseTransfer(
      tenantId,
      warehouseTransferId,
      editWarehouseTransferDTO
    );
  };

  /**
   * Deletes warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<void>}
   */
  public deleteWarehouseTransfer = (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<void> => {
    return this.deleteWarehouseTransferService.deleteWarehouseTransfer(
      tenantId,
      warehouseTransferId
    );
  };

  /**
   * Retrieves warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public getWarehouseTransfer = (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<IWarehouseTransfer> => {
    return this.getWarehouseTransferService.getWarehouseTransfer(
      tenantId,
      warehouseTransferId
    );
  };

  /**
   * Retrieves warehouses trans
   * @param   {number} tenantId
   * @param   {IGetWarehousesTransfersFilterDTO} filterDTO
   * @returns {Promise<IWarehouseTransfer>}
   */
  public getWarehousesTransfers = (
    tenantId: number,
    filterDTO: IGetWarehousesTransfersFilterDTO
  ) => {
    return this.getWarehousesTransfersService.getWarehouseTransfers(
      tenantId,
      filterDTO
    );
  };

  /**
   * Marks the warehouse transfer order as transferred.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public transferredWarehouseTransfer = (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<IWarehouseTransfer> => {
    return this.transferredWarehouseTransferService.transferredWarehouseTransfer(
      tenantId,
      warehouseTransferId
    );
  };

  /**
   * Marks the warehouse transfer order as initiated.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public initiateWarehouseTransfer = (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<IWarehouseTransfer> => {
    return this.initiateWarehouseTransferService.initiateWarehouseTransfer(
      tenantId,
      warehouseTransferId
    );
  };
}
