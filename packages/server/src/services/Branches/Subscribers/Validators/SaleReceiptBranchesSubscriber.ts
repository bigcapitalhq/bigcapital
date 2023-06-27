import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class SaleReceiptBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleReceipt.onCreating,
      this.validateBranchExistenceOnInvoiceCreating
    );
    bus.subscribe(
      events.saleReceipt.onEditing,
      this.validateBranchExistenceOnInvoiceEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {ISaleReceiptCreatingPayload} payload
   */
  private validateBranchExistenceOnInvoiceCreating = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      saleReceiptDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleReceiptEditingPayload} payload
   */
  private validateBranchExistenceOnInvoiceEditing = async ({
    saleReceiptDTO,
    tenantId,
  }: ISaleReceiptEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      saleReceiptDTO.branchId
    );
  };
}
