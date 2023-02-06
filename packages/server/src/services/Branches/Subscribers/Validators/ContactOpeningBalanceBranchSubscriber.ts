import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ICustomerEventCreatingPayload,
  ICustomerOpeningBalanceEditingPayload,
  IVendorEventCreatingPayload,
  IVendorOpeningBalanceEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class ContactBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.customers.onCreating,
      this.validateBranchExistanceOnCustomerCreating
    );
    bus.subscribe(
      events.customers.onOpeningBalanceChanging,
      this.validateBranchExistanceOnCustomerOpeningBalanceEditing
    );
    bus.subscribe(
      events.vendors.onCreating,
      this.validateBranchExistanceonVendorCreating
    );
    bus.subscribe(
      events.vendors.onOpeningBalanceChanging,
      this.validateBranchExistanceOnVendorOpeningBalanceEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on customer creating.
   * @param {ICustomerEventCreatingPayload} payload
   */
  private validateBranchExistanceOnCustomerCreating = async ({
    tenantId,
    customerDTO,
  }: ICustomerEventCreatingPayload) => {
    // Can't continue if the customer opening balance is zero.
    if (!customerDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      customerDTO.openingBalanceBranchId
    );
  };

  /**
   * Validate branch existance once customer opening balance editing.
   * @param {ICustomerOpeningBalanceEditingPayload} payload
   */
  private validateBranchExistanceOnCustomerOpeningBalanceEditing = async ({
    openingBalanceEditDTO,
    tenantId,
  }: ICustomerOpeningBalanceEditingPayload) => {
    if (!openingBalanceEditDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      openingBalanceEditDTO.openingBalanceBranchId
    );
  };

  /**
   * Validates the branch existance on vendor creating.
   * @param {IVendorEventCreatingPayload} payload -
   */
  private validateBranchExistanceonVendorCreating = async ({
    vendorDTO,
    tenantId,
  }: IVendorEventCreatingPayload) => {
    // Can't continue if the customer opening balance is zero.
    if (!vendorDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      vendorDTO.openingBalanceBranchId
    );
  };

  /**
   * Validate branch existance once the vendor opening balance editing.
   * @param {IVendorOpeningBalanceEditingPayload}
   */
  private validateBranchExistanceOnVendorOpeningBalanceEditing = async ({
    tenantId,
    openingBalanceEditDTO,
  }: IVendorOpeningBalanceEditingPayload) => {
    if (!openingBalanceEditDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      openingBalanceEditDTO.openingBalanceBranchId
    );
  };
}
