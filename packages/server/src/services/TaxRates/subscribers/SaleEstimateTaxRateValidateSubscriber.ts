import { Inject, Service } from 'typedi';
import {
  ISaleEstimateCreatingPayload,
  ISaleEstimateEditingPayload,
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { CommandTaxRatesValidators } from '../CommandTaxRatesValidators';

@Service()
export class SaleEstimateTaxRateValidateSubscriber {
  @Inject()
  private taxRateDTOValidator: CommandTaxRatesValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleEstimate.onCreating,
      this.validateSaleEstimateEntriesTaxCodeExistanceOnCreating
    );
    bus.subscribe(
      events.saleEstimate.onEditing,
      this.validateSaleEstimateEntriesTaxCodeExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate invoice entries tax rate code existance.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private validateSaleEstimateEntriesTaxCodeExistanceOnCreating = async ({
    estimateDTO,
    tenantId,
  }: ISaleEstimateCreatingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      estimateDTO.entries
    );
  };

  /**
   *
   * @param {ISaleInvoiceEditingPayload}
   */
  private validateSaleEstimateEntriesTaxCodeExistanceOnEditing = async ({
    tenantId,
    estimateDTO,
  }: ISaleEstimateEditingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      estimateDTO.entries
    );
  };
}
