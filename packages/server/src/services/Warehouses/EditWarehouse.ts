import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { IEditWarehouseDTO, IWarehouse } from '@/interfaces';
import { WarehouseValidator } from './WarehouseValidator';

@Service()
export class EditWarehouse {
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
    warehouseDTO: IEditWarehouseDTO,
    warehouseId: number
  ) => {
    if (warehouseDTO.code) {
      await this.validator.validateWarehouseCodeUnique(
        tenantId,
        warehouseDTO.code,
        warehouseId
      );
    }
  };

  /**
   * Edits a new warehouse on the system.
   * @param   {number} tenantId
   * @param   {ICreateWarehouseDTO} warehouseDTO
   * @returns {Promise<IWarehouse>}
   */
  public editWarehouse = async (
    tenantId: number,
    warehouseId: number,
    warehouseDTO: IEditWarehouseDTO
  ): Promise<IWarehouse> => {
    const { Warehouse } = this.tenancy.models(tenantId);

    // Authorize the warehouse DTO before editing.
    await this.authorize(tenantId, warehouseDTO, warehouseId);

    // Edits warehouse under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseEdit` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        tenantId,
        warehouseId,
        warehouseDTO,
        trx,
      });
      // Updates the given branch on the storage.
      const warehouse = await Warehouse.query().patchAndFetchById(warehouseId, {
        ...warehouseDTO,
      });
      // Triggers `onWarehouseEdited` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        tenantId,
        warehouse,
        warehouseDTO,
        trx,
      });
      return warehouse;
    });
  };
}
