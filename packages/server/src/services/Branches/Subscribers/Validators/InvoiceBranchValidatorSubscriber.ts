import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatingPayload,
  ISaleInvoiceEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class InvoiceBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleInvoice.onCreating,
      this.validateBranchExistenceOnInvoiceCreating
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.validateBranchExistenceOnInvoiceEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on invoice creating.
   * @param {ISaleInvoiceCreatingPayload} payload
   */
  private validateBranchExistenceOnInvoiceCreating = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      saleInvoiceDTO.branchId
    );
  };

  /**
   * Validate branch existence once invoice editing.
   * @param {ISaleInvoiceEditingPayload} payload
   */
  private validateBranchExistenceOnInvoiceEditing = async ({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      saleInvoiceDTO.branchId
    );
  };
}
