import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import {
  ICreditNoteEditingPayload,
  ICreditNoteCreatingPayload,
} from '@/modules/CreditNotes/types/CreditNotes.types';
import { events } from '@/common/events/events';

@Injectable()
export class CreditNoteWarehousesValidateSubscriber {
  constructor(
    private readonly warehouseDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {ICreditNoteCreatingPayload}
   */
  @OnEvent(events.creditNote.onCreating)
  async validateCreditNoteWarehouseExistanceOnCreating({
    creditNoteDTO,
  }: ICreditNoteCreatingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      creditNoteDTO,
    );
  }

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {ICreditNoteEditingPayload}
   */
  @OnEvent(events.creditNote.onEditing)
  async validateCreditNoteWarehouseExistanceOnEditing({
    creditNoteEditDTO,
  }: ICreditNoteEditingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      creditNoteEditDTO,
    );
  }
}
