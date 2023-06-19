import { Service, Inject } from 'typedi';


export class WarehousesTransfersService {
  createWarehouseTransfer = (
    tenantId: number,
    createWarehouseTransfer: ICreateWarehouseTransferDTO
  ) => {};

  editWarehouseTransfer = (
    tenantId: number,
    editWarehouseTransfer: IEditWarehouseTransferDTO
  ) => {};

  deleteWarehouseTransfer = (
    tenantId: number,
    warehouseTransferId: number
  ) => {};

  getWarehouseTransfer = (tenantId: number, warehouseTransferId: number) => {};

  getWarehouseTransfers = (tenantId: number) => {};
}
