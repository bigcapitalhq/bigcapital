import { IWarehouseMarkAsPrimaryPayload, IWarehouseMarkedAsPrimaryPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CRUDWarehouse } from './CRUDWarehouse';

@Service()
export class WarehouseMarkPrimary extends CRUDWarehouse {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Marks the given warehouse as primary.
   * @param   {number} tenantId
   * @param   {number} warehouseId
   * @returns {Promise<IWarehouse>}
   */
  public markAsPrimary = async (tenantId: number, warehouseId: number) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const oldWarehouse = await this.getWarehouseOrThrowNotFound(tenantId, warehouseId);
    // Updates the branches under unit-of-work enivrement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseMarkPrimary` event.
      await this.eventPublisher.emitAsync(events.warehouse.onMarkPrimary, {
        tenantId,
        oldWarehouse,
        trx,
      } as IWarehouseMarkAsPrimaryPayload);
      // marks all warehouses as not primary.
      await Warehouse.query(trx).update({ primary: false });

      // Marks the particular branch as primary.
      const markedWarehouse = await Warehouse.query(trx).patchAndFetchById(warehouseId, { primary: true });
      // Triggers `onWarehouseMarkedPrimary` event.
      await this.eventPublisher.emitAsync(events.warehouse.onMarkedPrimary, {
        tenantId,
        oldWarehouse,
        markedWarehouse,
        trx,
      } as IWarehouseMarkedAsPrimaryPayload);

      return markedWarehouse;
    });
  };
}
