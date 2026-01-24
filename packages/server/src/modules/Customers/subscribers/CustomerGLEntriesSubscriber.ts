import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ICustomerEventCreatedPayload,
  ICustomerEventDeletedPayload,
  ICustomerOpeningBalanceEditedPayload,
} from '../types/Customers.types';
import { events } from '@/common/events/events';
import { CustomerGLEntriesStorage } from '../CustomerGLEntriesStorage';

@Injectable()
export class CustomerWriteGLOpeningBalanceSubscriber {
  constructor(private readonly customerGLEntries: CustomerGLEntriesStorage) { }

  /**
   * Handles the writing opening balance journal entries once the customer created.
   */
  @OnEvent(events.customers.onCreated)
  public async handleWriteOpenBalanceEntries({
    customer,
    trx,
  }: ICustomerEventCreatedPayload) {
    // Writes the customer opening balance journal entries.
    if (customer.openingBalance) {
      await this.customerGLEntries.writeCustomerOpeningBalance(
        customer.id,
        trx,
      );
    }
  }

  /**
   * Handles the deleting opening balance journal entries once the customer deleted.
   */
  @OnEvent(events.customers.onDeleted)
  public async handleRevertOpeningBalanceEntries({
    customerId,
    trx,
  }: ICustomerEventDeletedPayload) {
    await this.customerGLEntries.revertCustomerOpeningBalance(customerId, trx);
  }

  /**
   * Handles the rewrite opening balance entries once opening balance changed.
   */
  @OnEvent(events.customers.onOpeningBalanceChanged)
  public async handleRewriteOpeningEntriesOnChanged({
    customer,
    trx,
  }: ICustomerOpeningBalanceEditedPayload) {
    if (customer.openingBalance) {
      await this.customerGLEntries.rewriteCustomerOpeningBalance(
        customer.id,
        trx,
      );
    } else {
      await this.customerGLEntries.revertCustomerOpeningBalance(
        customer.id,
        trx,
      );
    }
  }
}
