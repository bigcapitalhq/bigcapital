import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import {
  ICustomerOpeningBalanceEditingPayload,
  ICustomerEventCreatingPayload,
} from '@/modules/Customers/types/Customers.types';
import {
  IVendorEventCreatingPayload,
  IVendorOpeningBalanceEditingPayload,
} from '@/modules/Vendors/types/Vendors.types';

@Injectable()
export class ContactBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on customer creating.
   * @param {ICustomerEventCreatingPayload} payload
   */
  @OnEvent(events.customers.onCreating)
  async validateBranchExistanceOnCustomerCreating({
    customerDTO,
  }: ICustomerEventCreatingPayload) {
    // Can't continue if the customer opening balance is zero.
    if (!customerDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      customerDTO.openingBalanceBranchId,
    );
  }

  /**
   * Validate branch existance once customer opening balance editing.
   * @param {ICustomerOpeningBalanceEditingPayload} payload
   */
  @OnEvent(events.customers.onOpeningBalanceChanging)
  async validateBranchExistanceOnCustomerOpeningBalanceEditing({
    openingBalanceEditDTO,
  }: ICustomerOpeningBalanceEditingPayload) {
    if (!openingBalanceEditDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      openingBalanceEditDTO.openingBalanceBranchId,
    );
  }

  /**
   * Validates the branch existance on vendor creating.
   * @param {IVendorEventCreatingPayload} payload
   */
  @OnEvent(events.vendors.onCreating)
  async validateBranchExistanceonVendorCreating({
    vendorDTO,
  }: IVendorEventCreatingPayload) {
    // Can't continue if the customer opening balance is zero.
    if (!vendorDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      vendorDTO.openingBalanceBranchId,
    );
  }

  /**
   * Validate branch existance once the vendor opening balance editing.
   * @param {IVendorOpeningBalanceEditingPayload} payload
   */
  @OnEvent(events.vendors.onOpeningBalanceChanging)
  async validateBranchExistanceOnVendorOpeningBalanceEditing({
    openingBalanceEditDTO,
  }: IVendorOpeningBalanceEditingPayload) {
    if (!openingBalanceEditDTO.openingBalance) return;

    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      openingBalanceEditDTO.openingBalanceBranchId,
    );
  }
}
