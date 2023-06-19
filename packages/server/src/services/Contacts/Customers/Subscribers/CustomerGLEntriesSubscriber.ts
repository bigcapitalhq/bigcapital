import { Service, Inject } from 'typedi';
import {
  ICustomerEventCreatedPayload,
  ICustomerEventDeletedPayload,
  ICustomerOpeningBalanceEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { CustomerGLEntriesStorage } from '../CustomerGLEntriesStorage';

@Service()
export class CustomerWriteGLOpeningBalanceSubscriber {
  @Inject()
  private customerGLEntries: CustomerGLEntriesStorage;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.customers.onCreated,
      this.handleWriteOpenBalanceEntries
    );
    bus.subscribe(
      events.customers.onDeleted,
      this.handleRevertOpeningBalanceEntries
    );
    bus.subscribe(
      events.customers.onOpeningBalanceChanged,
      this.handleRewriteOpeningEntriesOnChanged
    );
  }

  /**
   * Handles the writing opening balance journal entries once the customer created.
   * @param {ICustomerEventCreatedPayload} payload -
   */
  private handleWriteOpenBalanceEntries = async ({
    tenantId,
    customer,
    trx,
  }: ICustomerEventCreatedPayload) => {
    // Writes the customer opening balance journal entries.
    if (customer.openingBalance) {
      await this.customerGLEntries.writeCustomerOpeningBalance(
        tenantId,
        customer.id,
        trx
      );
    }
  };

  /**
   * Handles the deleting opeing balance journal entrise once the customer deleted.
   * @param {ICustomerEventDeletedPayload} payload -
   */
  private handleRevertOpeningBalanceEntries = async ({
    tenantId,
    customerId,
    trx,
  }: ICustomerEventDeletedPayload) => {
    await this.customerGLEntries.revertCustomerOpeningBalance(
      tenantId,
      customerId,
      trx
    );
  };

  /**
   * Handles the rewrite opening balance entries once opening balance changed.
   * @param {ICustomerOpeningBalanceEditedPayload} payload -
   */
  private handleRewriteOpeningEntriesOnChanged = async ({
    tenantId,
    customer,
    trx,
  }: ICustomerOpeningBalanceEditedPayload) => {
    if (customer.openingBalance) {
      await this.customerGLEntries.rewriteCustomerOpeningBalance(
        tenantId,
        customer.id,
        trx
      );
    } else {
      await this.customerGLEntries.revertCustomerOpeningBalance(
        tenantId,
        customer.id,
        trx
      );
    }
  };
}
