import { Inject, Service } from 'typedi';
import {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { CommandTaxRatesValidators } from '../CommandTaxRatesValidators';

@Service()
export class SaleInvoiceTaxRateValidateSubscriber {
  @Inject()
  private taxRateDTOValidator: CommandTaxRatesValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreating,
      this.validateSaleInvoiceEntriesTaxCodeExistanceOnCreating
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.validateSaleInvoiceEntriesTaxCodeExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate invoice entries tax rate code existance.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private validateSaleInvoiceEntriesTaxCodeExistanceOnCreating = async ({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceCreatingPaylaod) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      saleInvoiceDTO.entries
    );
  };

  /**
   *
   * @param {ISaleInvoiceEditingPayload}
   */
  private validateSaleInvoiceEntriesTaxCodeExistanceOnEditing = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      saleInvoiceDTO.entries
    );
  };
}
