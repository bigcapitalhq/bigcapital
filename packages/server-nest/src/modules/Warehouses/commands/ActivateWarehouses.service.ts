import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { CreateInitialWarehouse } from './CreateInitialWarehouse.service';
import { WarehousesSettings } from '../WarehousesSettings';
import { ERRORS } from '../contants';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';

@Injectable()
export class ActivateWarehousesService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {CreateInitialWarehouse} createInitialWarehouse - Create initial warehouse service.
   * @param {WarehousesSettings} settings - Warehouses settings.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    private readonly createInitialWarehouse: CreateInitialWarehouse,
    private readonly settings: WarehousesSettings,
  ) {}

  /**
   * Throws error if the multi-warehouses is already activated.
   */
  private throwIfWarehousesActivated(isActivated: boolean): void {
    if (isActivated) {
      throw new ServiceError(ERRORS.MUTLI_WAREHOUSES_ALREADY_ACTIVATED);
    }
  }

  /**
   * Activates the multi-warehouses.
   *
   * - Creates a new warehouses and mark it as primary.
   * - Seed warehouses items quantity.
   * - Mutate inventory transactions with the primary warehouse.
   */
  public async activateWarehouses(): Promise<void> {
    const isActivated = await this.settings.isMultiWarehousesActive();
    this.throwIfWarehousesActivated(isActivated);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventEmitter.emitAsync(events.warehouse.onActivate, { trx });

      const primaryWarehouse =
        await this.createInitialWarehouse.createInitialWarehouse();

      this.settings.markMutliwarehoussAsActivated();

      await this.eventEmitter.emitAsync(events.warehouse.onActivated, {
        primaryWarehouse,
        trx,
      });
    });
  }
}
