import { Inject, Service } from 'typedi';
import { IBillCreatingPayload, IBillEditingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { CommandTaxRatesValidators } from '../CommandTaxRatesValidators';

@Service()
export class BillTaxRateValidateSubscriber {
  @Inject()
  private taxRateDTOValidator: CommandTaxRatesValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreating,
      this.validateBillEntriesTaxCodeExistanceOnCreating
    );
    bus.subscribe(
      events.bill.onCreating,
      this.validateBillEntriesTaxIdExistanceOnCreating
    );
    bus.subscribe(
      events.bill.onEditing,
      this.validateBillEntriesTaxCodeExistanceOnEditing
    );
    bus.subscribe(
      events.bill.onEditing,
      this.validateBillEntriesTaxIdExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate bill entries tax rate code existance when creating.
   * @param {IBillCreatingPayload}
   */
  private validateBillEntriesTaxCodeExistanceOnCreating = async ({
    billDTO,
    tenantId,
  }: IBillCreatingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      billDTO.entries
    );
  };

  /**
   * Validate the tax rate id existance when creating.
   * @param {IBillCreatingPayload}
   */
  private validateBillEntriesTaxIdExistanceOnCreating = async ({
    billDTO,
    tenantId,
  }: IBillCreatingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      tenantId,
      billDTO.entries
    );
  };

  /**
   * Validate bill entries tax rate code existance when editing.
   * @param {IBillEditingPayload}
   */
  private validateBillEntriesTaxCodeExistanceOnEditing = async ({
    tenantId,
    billDTO,
  }: IBillEditingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(
      tenantId,
      billDTO.entries
    );
  };

  /**
   * Validates the bill entries tax rate id existance when editing.
   * @param {ISaleInvoiceEditingPayload} payload -
   */
  private validateBillEntriesTaxIdExistanceOnEditing = async ({
    tenantId,
    billDTO,
  }: IBillEditingPayload) => {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      tenantId,
      billDTO.entries
    );
  };
}
