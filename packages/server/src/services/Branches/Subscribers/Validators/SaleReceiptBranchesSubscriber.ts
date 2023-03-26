import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class SaleReceiptBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleReceipt.onCreating,
      this.validateBranchExistanceOnInvoiceCreating
    );
    bus.subscribe(
      events.saleReceipt.onEditing,
      this.validateBranchExistanceOnInvoiceEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleReceiptCreatingPayload} payload
   */
  private validateBranchExistanceOnInvoiceCreating = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      saleReceiptDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleReceiptEditingPayload} payload
   */
  private validateBranchExistanceOnInvoiceEditing = async ({
    saleReceiptDTO,
    tenantId,
  }: ISaleReceiptEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      saleReceiptDTO.branchId
    );
  };
}
