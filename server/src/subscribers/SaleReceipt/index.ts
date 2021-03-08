import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SettingsService from 'services/Settings/SettingsService';
import SalesReceiptService from 'services/Sales/SalesReceipts';

@EventSubscriber()
export default class SaleReceiptSubscriber {
  logger: any;
  tenancy: TenancyService;
  settingsService: SettingsService;
  saleReceiptsService: SalesReceiptService;

  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.settingsService = Container.get(SettingsService);
    this.saleReceiptsService = Container.get(SalesReceiptService);
  }
 
  /**
   * Handle sale receipt increment next number once be created.
   */
  @On(events.saleReceipt.onCreated)
  public async handleReceiptNextNumberIncrement({ tenantId, saleReceiptId }) {
    await this.saleReceiptsService.incrementNextReceiptNumber(tenantId);
  }
}
