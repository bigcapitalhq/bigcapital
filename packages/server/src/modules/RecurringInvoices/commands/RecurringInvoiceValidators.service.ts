import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ServiceError } from '@/modules/Items/ServiceError';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { Customer } from '@/modules/Customers/models/Customer';
import { RecurringInvoice } from '../models/RecurringInvoice';
import {
  ERRORS,
  RecurringInvoiceDeliveryMode,
  RecurringInvoiceStatus,
} from '../RecurringInvoice.types';
import { RECURRENCE_DATE_FORMAT } from '../utils/recurrence';

@Injectable()
export class RecurringInvoiceValidators {
  constructor(
    private readonly autoIncrementOrders: AutoIncrementOrdersService,
  ) {}
  /**
   * Validates that the end date is not before the start date.
   */
  public validateDateRange(startDate: string, endDate?: string | null): void {
    if (!startDate) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_START_DATE_REQUIRED);
    }
    if (endDate && moment(endDate).isBefore(moment(startDate), 'day')) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_END_DATE_INVALID);
    }
  }

  /**
   * Validates the profile name.
   */
  public validateProfileName(profileName?: string): void {
    if (!profileName || !profileName.trim()) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_PROFILE_NAME_REQUIRED);
    }
  }

  /**
   * Recurring invoices are generated in the background, so they need the
   * invoice auto-increment setting to assign invoice numbers.
   */
  public async validateInvoiceAutoIncrement(): Promise<void> {
    const isAutoIncrement =
      await this.autoIncrementOrders.autoIncrementEnabled('sales_invoices');

    if (!isAutoIncrement) {
      throw new ServiceError(
        ERRORS.RECURRING_INVOICE_AUTO_INCREMENT_REQUIRED,
        'Recurring invoices require auto-increment invoice numbers. Enable auto-increment in the invoice settings first.',
      );
    }
  }

  /**
   * Validates that the customer can receive auto-generated invoice emails.
   */
  public validateCustomerEmail(
    customer: Customer,
    deliveryMode: RecurringInvoiceDeliveryMode,
  ): void {
    if (
      deliveryMode === RecurringInvoiceDeliveryMode.Email &&
      !customer.email?.trim()
    ) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_CUSTOMER_EMAIL_REQUIRED);
    }
  }

  /**
   * Validates that the profile can be paused.
   */
  public validateCanPause(recurringInvoice: RecurringInvoice): void {
    if (recurringInvoice.status === RecurringInvoiceStatus.Completed) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_ALREADY_COMPLETED);
    }
    if (recurringInvoice.status === RecurringInvoiceStatus.Paused) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_ALREADY_PAUSED);
    }
  }

  /**
   * Validates that the profile can be resumed.
   */
  public validateCanResume(recurringInvoice: RecurringInvoice): void {
    if (recurringInvoice.status === RecurringInvoiceStatus.Completed) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_ALREADY_COMPLETED);
    }
    if (recurringInvoice.status !== RecurringInvoiceStatus.Paused) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_NOT_PAUSED);
    }
  }

  /**
   * Formats a date string to the recurrence format.
   */
  public formatDate(date: string | Date): string {
    return moment(date).format(RECURRENCE_DATE_FORMAT);
  }
}
