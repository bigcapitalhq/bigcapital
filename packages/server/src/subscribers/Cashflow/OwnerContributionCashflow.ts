import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { map, head } from 'lodash';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import SaleInvoicesCost from '@/services/Sales/SalesInvoicesCost';
import InventoryItemsQuantitySync from '@/services/Inventory/InventoryItemsQuantitySync';
import InventoryService from '@/services/Inventory/Inventory';

@EventSubscriber()
export class OwnerContributionCashflowSubscriber {
  depends: number = 0;
  startingDate: Date;
  saleInvoicesCost: SaleInvoicesCost;
  tenancy: TenancyService;
  itemsQuantitySync: InventoryItemsQuantitySync;
  inventoryService: InventoryService;
  agenda: any;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenancy = Container.get(TenancyService);
  }

  /**
   * Marks items cost compute running state.
   */
  @On(events.cashflow.onOwnerContributionCreate)
  async writeOwnerContributionJournalEntries({
    
  }) {

  }

}
