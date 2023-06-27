import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ICustomerEventCreatingPayload,
  ICustomerOpeningBalanceEditingPayload,
  IVendorEventCreatingPayload,
  IVendorOpeningBalanceEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class ContactBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.customers.onCreating,
      this.validateBranchExistenceOnCustomerCreating
    );
    bus.subscribe(
      events.customers.onOpeningBalanceChanging,
      this.validateBranchExistenceOnCustomerOpeningBalanceEditing
    );
    bus.subscribe(
      events.vendors.onCreating,
      this.validateBranchExistenceOnVendorCreating
    );
    bus.subscribe(
      events.vendors.onOpeningBalanceChanging,
      this.validateBranchExistenceOnVendorOpeningBalanceEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on customer creating.
   * @param {ICustomerEventCreatingPayload} payload
   */
  private validateBranchExistenceOnCustomerCreating = async ({
    tenantId,
    customerDTO,
  }: ICustomerEventCreatingPayload) => {
    // Can't continue if the customer opening balance is zero.
    if (!customerDTO.openingBalance) return;

    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      customerDTO.openingBalanceBranchId
    );
  };

  /**
   * Validate branch existence once customer opening balance editing.
   * @param {ICustomerOpeningBalanceEditingPayload} payload
   */
  private validateBranchExistenceOnCustomerOpeningBalanceEditing = async ({
    openingBalanceEditDTO,
    tenantId,
  }: ICustomerOpeningBalanceEditingPayload) => {
    if (!openingBalanceEditDTO.openingBalance) return;

    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      openingBalanceEditDTO.openingBalanceBranchId
    );
  };

  /**
   * Validates the branch existence on vendor creating.
   * @param {IVendorEventCreatingPayload} payload -
   */
  private validateBranchExistenceOnVendorCreating = async ({
    vendorDTO,
    tenantId,
  }: IVendorEventCreatingPayload) => {
    // Can't continue if the customer opening balance is zero.
    if (!vendorDTO.openingBalance) return;

    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      vendorDTO.openingBalanceBranchId
    );
  };

  /**
   * Validate branch existence once the vendor opening balance editing.
   * @param {IVendorOpeningBalanceEditingPayload}
   */
  private validateBranchExistenceOnVendorOpeningBalanceEditing = async ({
    tenantId,
    openingBalanceEditDTO,
  }: IVendorOpeningBalanceEditingPayload) => {
    if (!openingBalanceEditDTO.openingBalance) return;

    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      openingBalanceEditDTO.openingBalanceBranchId
    );
  };
}
