import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { IWarehouseTransfer } from '@/interfaces';
import { CRUDWarehouseTransfer } from './CRUDWarehouseTransfer';
import { WarehouseTransferTransformer } from './WarehouseTransferTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetWarehouseTransfer extends CRUDWarehouseTransfer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the specific warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @param   {IEditWarehouseTransferDTO} editWarehouseDTO
   * @returns {Promise<IWarehouseTransfer>}
   */
  public getWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<IWarehouseTransfer> => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Retrieves the old warehouse transfer transaction.
    const warehouseTransfer = await WarehouseTransfer.query()
      .findById(warehouseTransferId)
      .withGraphFetched('entries.item')
      .withGraphFetched('fromWarehouse')
      .withGraphFetched('toWarehouse');

    this.throwIfTransferNotFound(warehouseTransfer);

    // Retrieves the transformed warehouse transfers.
    return this.transformer.transform(
      tenantId,
      warehouseTransfer,
      new WarehouseTransferTransformer()
    );
  };
}
