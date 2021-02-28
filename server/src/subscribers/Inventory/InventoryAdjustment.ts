import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import InventoryAdjustmentService from 'services/Inventory/InventoryAdjustmentService';

@EventSubscriber()
export default class InventoryAdjustmentsSubscriber {
  logger: any;
  tenancy: TenancyService;
  inventoryAdjustment: InventoryAdjustmentService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.inventoryAdjustment = Container.get(InventoryAdjustmentService);
  }

  /**
   * Handles writing inventory transactions once the quick adjustment created.
   */
  @On(events.inventoryAdjustment.onQuickCreated)
  async handleWriteInventoryTransactionsOnceQuickCreated({
    tenantId,
    inventoryAdjustment,
  }) {
    // Can't continue if the inventory adjustment is not published.
    if (!inventoryAdjustment.isPublished) { return; }

    await this.inventoryAdjustment.writeInventoryTransactions(
      tenantId,
      inventoryAdjustment
    );
  }

  /**
   * Handles reverting invetory transactions once the inventory adjustment deleted.
   */
  @On(events.inventoryAdjustment.onDeleted)
  async handleRevertInventoryTransactionsOnceDeleted({
    tenantId,
    inventoryAdjustmentId,
    oldInventoryAdjustment,
  }) {
    // Can't continue if the inventory adjustment is not published.
    if (!oldInventoryAdjustment.isPublished) { return; }

    await this.inventoryAdjustment.revertInventoryTransactions(
      tenantId,
      inventoryAdjustmentId,
    );
  }

  /**
   * Handles writing inventory transactions once the quick adjustment created.
   */
  @On(events.inventoryAdjustment.onPublished)
  async handleWriteInventoryTransactionsOncePublished({
    tenantId,
    inventoryAdjustment,
  }) {
    await this.inventoryAdjustment.writeInventoryTransactions(
      tenantId,
      inventoryAdjustment
    )
  }
}