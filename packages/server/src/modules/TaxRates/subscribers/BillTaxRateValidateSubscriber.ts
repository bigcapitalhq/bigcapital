import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { CommandTaxRatesValidators } from '../commands/CommandTaxRatesValidator.service';
import { Injectable } from '@nestjs/common';
import { IBillCreatingPayload } from '@/modules/Bills/Bills.types';
import { IBillEditingPayload } from '@/modules/Bills/Bills.types';

@Injectable()
export class BillTaxRateValidateSubscriber {
  constructor(
    private readonly taxRateDTOValidator: CommandTaxRatesValidators,
  ) {}

  /**
   * Validate bill entries tax rate code existance when creating.
   * @param {IBillCreatingPayload}
   */
  @OnEvent(events.bill.onCreating)
  async validateBillEntriesTaxCodeExistanceOnCreating({
    billDTO,
  }: IBillCreatingPayload) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(billDTO.entries);
  }

  /**
   * Validate the tax rate id existance when creating.
   * @param {IBillCreatingPayload}
   */
  @OnEvent(events.bill.onCreating)
  async validateBillEntriesTaxIdExistanceOnCreating({
    billDTO,
  }: IBillCreatingPayload) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      billDTO.entries,
    );
  }

  /**
   * Validate bill entries tax rate code existance when editing.
   * @param {IBillEditingPayload}
   */
  @OnEvent(events.bill.onEditing)
  async validateBillEntriesTaxCodeExistanceOnEditing({
    billDTO,
  }: IBillEditingPayload) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCode(billDTO.entries);
  }

  /**
   * Validates the bill entries tax rate id existance when editing.
   * @param {ISaleInvoiceEditingPayload} payload -
   */
  @OnEvent(events.bill.onEditing)
  async validateBillEntriesTaxIdExistanceOnEditing({
    billDTO,
  }: IBillEditingPayload) {
    await this.taxRateDTOValidator.validateItemEntriesTaxCodeId(
      billDTO.entries,
    );
  }
}
