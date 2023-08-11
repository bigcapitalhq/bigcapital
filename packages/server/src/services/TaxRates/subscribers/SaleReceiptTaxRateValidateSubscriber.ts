import { Inject, Service } from 'typedi';
import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { CommandTaxRatesValidators } from '../CommandTaxRatesValidators';

@Service()
export class SaleReceiptTaxRateValidateSubscriber {
  @Inject()
  private taxRateDTOValidator: CommandTaxRatesValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreating,
      this.validateSaleReceiptEntriesTaxCodeExistanceOnCreating
    );
    bus.subscribe(
      events.saleReceipt.onEditing,
      this.validateSaleReceiptEntriesTaxCodeExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate receipt entries tax rate code existance.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private validateSaleReceiptEntriesTaxCodeExistanceOnCreating = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      saleReceiptDTO.entries
    );
  };

  /**
   *
   * @param {ISaleInvoiceEditingPayload}
   */
  private validateSaleReceiptEntriesTaxCodeExistanceOnEditing = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      saleReceiptDTO.entries
    );
  };
}
