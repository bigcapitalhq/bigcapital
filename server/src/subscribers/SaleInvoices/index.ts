import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SettingsService from 'services/Settings/SettingsService';
import SaleEstimateService from 'services/Sales/SalesEstimate';
import SaleInvoicesService from 'services/Sales/SalesInvoices';

@EventSubscriber()
export default class SaleInvoiceSubscriber {
  logger: any;
  tenancy: TenancyService;
  settingsService: SettingsService;
  saleEstimatesService: SaleEstimateService;
  saleInvoicesService: SaleInvoicesService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.settingsService = Container.get(SettingsService);
    this.saleEstimatesService = Container.get(SaleEstimateService);
    this.saleInvoicesService = Container.get(SaleInvoicesService);
  }

  /**
   * Marks the sale estimate as converted from the sale invoice once created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleMarkEstimateConvertOnceInvoiceCreated({
    tenantId,
    saleInvoice,
    saleInvoiceDTO,
    saleInvoiceId,
  }) {
    if (saleInvoiceDTO.fromEstimateId) {
      await this.saleEstimatesService.convertEstimateToInvoice(
        tenantId,
        saleInvoiceDTO.fromEstimateId,
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
  }) {
    await this.saleInvoicesService.incrementNextInvoiceNumber(
      tenantId,
    );
  }
}
