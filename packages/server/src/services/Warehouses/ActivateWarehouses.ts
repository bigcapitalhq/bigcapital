import { Inject, Service } from 'typedi';
import { Knex } from 'knex';

import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import { CreateInitialWarehouse } from './CreateInitialWarehouse';
import { WarehousesSettings } from './WarehousesSettings';

import events from '@/subscribers/events';
import { ERRORS } from './constants';

@Service()
export class ActivateWarehouses {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  createInitialWarehouse: CreateInitialWarehouse;

  @Inject()
  settings: WarehousesSettings;

  /**
   * Throws error if the multi-warehouses is already activated.
   * @param {boolean} isActivated
   */
  private throwIfWarehousesActivated = (isActivated: boolean) => {
    if (isActivated) {
      throw new ServiceError(ERRORS.MULTI_WAREHOUSES_ALREADY_ACTIVATED);
    }
  };

  /**
   * Activates the multi-warehouses.
   *
   * - Creates a new warehouses and mark it as primary.
   * - Seed warehouses items quantity.
   * - Mutate inventory transactions with the primary warehouse.
   * --------
   * @param   {number} tenantId
   * @returns {Promise<void>}
   */
  public activateWarehouses = (tenantId: number): Promise<void> => {
    // Retrieve whether the multi-warehouses is active.
    const isActivated = this.settings.isMultiWarehousesActive(tenantId);

    // Throw error if the warehouses is already activated.
    this.throwIfWarehousesActivated(isActivated);

    // Activates multi-warehouses on unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseActivate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onActivate, {
        tenantId,
        trx,
      });
      // Creates a primary warehouse on the storage..
      const primaryWarehouse =
        await this.createInitialWarehouse.createInitialWarehouse(tenantId);

      // Marks the multi-warehouses is activated.
      this.settings.markMultiWarehousesAsActivated(,,,,,tenantId);

      // Triggers `onWarehouseActivated` event.
      await this.eventPublisher.emitAsync(events.warehouse.onActivated, {
        tenantId,
        primaryWarehouse,
        trx,
      });
    });
  };
}
