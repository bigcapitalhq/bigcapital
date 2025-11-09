import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
} from '@/modules/SaleReceipts/types/SaleReceipts.types';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class SaleReceiptBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleReceiptCreatingPayload} payload
   */
  @OnEvent(events.saleReceipt.onCreating)
  async validateBranchExistanceOnInvoiceCreating({
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      saleReceiptDTO.branchId,
    );
  }

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleReceiptEditingPayload} payload
   */
  @OnEvent(events.saleReceipt.onEditing)
  async validateBranchExistanceOnInvoiceEditing({
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      saleReceiptDTO.branchId,
    );
  }
}
