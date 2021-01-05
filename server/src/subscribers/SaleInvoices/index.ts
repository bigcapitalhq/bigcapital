import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SettingsService from 'services/Settings/SettingsService';
import SaleEstimateService from 'services/Sales/SalesEstimate';

@EventSubscriber()
export default class SaleInvoiceSubscriber {
  logger: any;
  tenancy: TenancyService;
  settingsService: SettingsService;
  saleEstimatesService: SaleEstimateService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.settingsService = Container.get(SettingsService);
    this.saleEstimatesService = Container.get(SaleEstimateService);
  }

  /**
   * Marks the sale estimate as converted from the sale invoice once created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleMarkEstimateConvert({
    tenantId,
    saleInvoice,
    saleInvoiceId,
  }) {
    if (saleInvoice.fromEstimateId) {
      this.saleEstimatesService.convertEstimateToInvoice(
        tenantId,
        saleInvoice.fromEstiamteId,
        saleInvoiceId
      );
    }
  }

  /**
   * Handles sale invoice next number increment once invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleInvoiceNextNumberIncrement({
    tenantId,
    saleInvoiceId,
    saleInvoice,
  }) {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'sales_invoices',
    });
  }
}
