import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IWarehouseMarkAsPrimaryPayload,
  IWarehouseMarkedAsPrimaryPayload,
} from '../Warehouse.types';
import { Warehouse } from '../models/Warehouse.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class WarehouseMarkPrimary {
  constructor(
    @Inject(Warehouse.name)
    private readonly warehouseModel: typeof Warehouse,
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
  ) {
  }

  /**
   * Marks the given warehouse as primary.
   * @param {number} warehouseId
   * @returns {Promise<IWarehouse>}
   */
  public async markAsPrimary(warehouseId: number) {
    const oldWarehouse = await this.warehouseModel
      .query()
      .findById(warehouseId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(events.warehouse.onMarkPrimary, {
        oldWarehouse,
        trx,
      } as IWarehouseMarkAsPrimaryPayload);

      await this.warehouseModel.query(trx).update({ primary: false });

      const markedWarehouse = await this.warehouseModel
        .query(trx)
        .patchAndFetchById(warehouseId, { primary: true });

      await this.eventPublisher.emitAsync(events.warehouse.onMarkedPrimary, {
        oldWarehouse,
        markedWarehouse,
        trx,
      } as IWarehouseMarkedAsPrimaryPayload);

      return markedWarehouse;
    });
  }
}
