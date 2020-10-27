import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SettingsService from 'services/Settings/SettingsService';

@EventSubscriber()
export default class SaleReceiptSubscriber {
  logger: any;
  tenancy: TenancyService;
  settingsService: SettingsService;

  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.settingsService = Container.get(SettingsService);
  }

  /**
   * Handle sale receipt increment next number once be created.
   */
  @On(events.saleReceipt.onCreated)
  public async handleReceiptNextNumberIncrement({ tenantId, saleReceiptId }) {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'sales_receipts',
    });
  }
}