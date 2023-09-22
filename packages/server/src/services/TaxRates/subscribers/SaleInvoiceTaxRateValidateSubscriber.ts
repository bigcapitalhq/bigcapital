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
      events.saleInvoice.onCreating,
      this.validateSaleInvoiceEntriesTaxIdExistanceOnCreating
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.validateSaleInvoiceEntriesTaxCodeExistanceOnEditing
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.validateSaleInvoiceEntriesTaxIdExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate invoice entries tax rate code existance when creating.
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
   * Validate the tax rate id existance when creating.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private validateSaleInvoiceEntriesTaxIdExistanceOnCreating = async ({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceCreatingPaylaod) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      tenantId,
      saleInvoiceDTO.entries
    );
  };

  /**
   * Validate invoice entries tax rate code existance when editing.
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

  /**
   * Validates the invoice entries tax rate id existance when editing.
   * @param {ISaleInvoiceEditingPayload} payload -
   */
  private validateSaleInvoiceEntriesTaxIdExistanceOnEditing = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      tenantId,
      saleInvoiceDTO.entries
    );
  };
}
