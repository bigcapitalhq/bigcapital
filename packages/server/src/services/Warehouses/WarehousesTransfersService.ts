import { Service, Inject } from 'typedi';


export class WarehousesTransfersService {
  createWarehouseTranser = (
    tenantId: number,
    createWarehouseTransfer: ICreateWarehouseTransferDTO
  ) => {};

  editWarehouseTranser = (
    tenantId: number,
    editWarehouseTransfer: IEditWarehouseTransferDTO
  ) => {};

  deleteWarehouseTranser = (
    tenantId: number,
    warehouseTransferId: number
  ) => {};

  getWarehouseTransfer = (tenantId: number, warehouseTransferId: number) => {};

  getWarehouseTransfers = (tenantId: number) => {};
}
