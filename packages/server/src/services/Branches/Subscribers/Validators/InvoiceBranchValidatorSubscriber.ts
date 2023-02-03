import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class InvoiceBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleInvoice.onCreating,
      this.validateBranchExistanceOnInvoiceCreating
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.validateBranchExistanceOnInvoiceEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on invoice creating.
   * @param {ISaleInvoiceCreatingPaylaod} payload
   */
  private validateBranchExistanceOnInvoiceCreating = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      saleInvoiceDTO.branchId
    );
  };

  /**
   * Validate branch existance once invoice editing.
   * @param {ISaleInvoiceEditingPayload} payload
   */
  private validateBranchExistanceOnInvoiceEditing = async ({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      saleInvoiceDTO.branchId
    );
  };
}
