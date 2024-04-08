import { IWarehouseDeletePayload, IWarehouseDeletedPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CRUDWarehouse } from './CRUDWarehouse';
import { WarehouseValidator } from './WarehouseValidator';
import { ERRORS } from './contants';

@Service()
export class DeleteWarehouse extends CRUDWarehouse {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  validator: WarehouseValidator;

  /**
   * Validates the given warehouse before deleting.
   * @param   {number} tenantId
   * @param   {number} warehouseId
   * @returns {Promise<void>}
   */
  public authorize = async (tenantId: number, warehouseId: number) => {
    await this.validator.validateWarehouseNotOnlyWarehouse(tenantId, warehouseId);
  };

  /**
   * Deletes specific warehouse.
   * @param   {number} tenantId
   * @param   {number} warehouseId
   * @returns {Promise<void>}
   */
  public deleteWarehouse = async (tenantId: number, warehouseId: number): Promise<void> => {
    const { Warehouse } = this.tenancy.models(tenantId);

    // Retrieves the old warehouse or throw not found service error.
    const oldWarehouse = await Warehouse.query().findById(warehouseId).throwIfNotFound().queryAndThrowIfHasRelations({
      type: ERRORS.WAREHOUSE_HAS_ASSOCIATED_TRANSACTIONS,
    });

    // Validates the given warehouse before deleting.
    await this.authorize(tenantId, warehouseId);

    // Creates a new warehouse under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      const eventPayload = {
        tenantId,
        warehouseId,
        oldWarehouse,
        trx,
      } as IWarehouseDeletePayload | IWarehouseDeletedPayload;

      // Triggers `onWarehouseCreate`.
      await this.eventPublisher.emitAsync(events.warehouse.onDelete, eventPayload);
      // Delets the given warehouse from the storage.
      await Warehouse.query().findById(warehouseId).delete();

      // Triggers `onWarehouseCreated`.
      await this.eventPublisher.emitAsync(events.warehouse.onDeleted, eventPayload as IWarehouseDeletedPayload);
    });
  };
}
