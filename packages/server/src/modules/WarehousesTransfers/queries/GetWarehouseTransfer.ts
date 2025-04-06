import { WarehouseTransferTransformer } from './WarehouseTransferTransfomer';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { ModelObject } from 'objection';

@Injectable()
export class GetWarehouseTransfer {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   * Retrieves the specific warehouse transfer transaction.
   * @param   {number} warehouseTransferId
   * @param   {IEditWarehouseTransferDTO} editWarehouseDTO
   * @returns {Promise<IWarehouseTransfer>}
   */
  public getWarehouseTransfer = async (
    warehouseTransferId: number,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    // Retrieves the old warehouse transfer transaction.
    const warehouseTransfer = await this.warehouseTransferModel()
      .query()
      .findById(warehouseTransferId)
      .withGraphFetched('entries.item')
      .withGraphFetched('fromWarehouse')
      .withGraphFetched('toWarehouse')
      .throwIfNotFound();

    // Retrieves the transfromed warehouse transfers.
    return this.transformer.transform(
      warehouseTransfer,
      new WarehouseTransferTransformer(),
    );
  };
}
