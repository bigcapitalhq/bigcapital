import { CommandTaxRatesValidators } from '../commands/CommandTaxRatesValidator.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import { events } from '@/common/events/events';

@Injectable()
export class SaleInvoiceTaxRateValidateSubscriber {
  constructor(
    private readonly taxRateDTOValidator: CommandTaxRatesValidators,
  ) {}

  /**
   * Validate invoice entries tax rate code existance when creating.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  @OnEvent(events.saleInvoice.onCreating)
  async validateSaleInvoiceEntriesTaxCodeExistanceOnCreating({
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      saleInvoiceDTO.entries,
    );
  }

  /**
   * Validate the tax rate id existance when creating.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  @OnEvent(events.saleInvoice.onCreating)
  async validateSaleInvoiceEntriesTaxIdExistanceOnCreating({
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      saleInvoiceDTO.entries,
    );
  }

  /**
   * Validate invoice entries tax rate code existance when editing.
   * @param {ISaleInvoiceEditingPayload}
   */
  @OnEvent(events.saleInvoice.onEditing)
  async validateSaleInvoiceEntriesTaxCodeExistanceOnEditing({
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      saleInvoiceDTO.entries,
    );
  }

  /**
   * Validates the invoice entries tax rate id existance when editing.
   * @param {ISaleInvoiceEditingPayload} payload -
   */
  @OnEvent(events.saleInvoice.onEditing)
  async validateSaleInvoiceEntriesTaxIdExistanceOnEditing({
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      saleInvoiceDTO.entries,
    );
  }
}
