import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import {
  ICreateWarehouseDTO,
  IWarehouse,
  IWarehouseCreatedPayload,
  IWarehouseCreatePayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { WarehouseValidator } from './WarehouseValidator';

@Service()
export class CreateWarehouse {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private validator: WarehouseValidator;

  /**
   * Authorize the warehouse before deleting.
   * @param {number} tenantId -
   * @param {ICreateWarehouseDTO} warehouseDTO -
   */
  public authorize = async (
    tenantId: number,
    warehouseDTO: ICreateWarehouseDTO
  ) => {
    if (warehouseDTO.code) {
      await this.validator.validateWarehouseCodeUnique(
        tenantId,
        warehouseDTO.code
      );
    }
  };

  /**
   * Creates a new warehouse on the system.
   * @param {number} tenantId
   * @param {ICreateWarehouseDTO} warehouseDTO
   */
  public createWarehouse = async (
    tenantId: number,
    warehouseDTO: ICreateWarehouseDTO
  ): Promise<IWarehouse> => {
    const { Warehouse } = this.tenancy.models(tenantId);

    // Authorize warehouse before creating.
    await this.authorize(tenantId, warehouseDTO);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseCreate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        tenantId,
        warehouseDTO,
        trx,
      } as IWarehouseCreatePayload);

      // Creates a new warehouse on the storage.
      const warehouse = await Warehouse.query(trx).insertAndFetch({
        ...warehouseDTO,
      });
      // Triggers `onWarehouseCreated` event.
      await this.eventPublisher.emitAsync(events.warehouse.onCreated, {
        tenantId,
        warehouseDTO,
        warehouse,
        trx,
      } as IWarehouseCreatedPayload);

      return warehouse;
    });
  };
}
