import moment from 'moment';
import { defaultTo } from 'lodash';
import {
  IAgingPeriod,
  ISaleInvoice,
  IBill,
  IAgingPeriodTotal,
  IContact,
} from 'interfaces';
import AgingReport from './AgingReport';
import { Dictionary } from 'tsyringe/dist/typings/types';

export default abstract class AgingSummaryReport extends AgingReport {
  protected readonly contacts: IContact[];
  protected readonly agingPeriods: IAgingPeriod[] = [];
  protected readonly baseCurrency: string;
  protected readonly unpaidInvoices: (ISaleInvoice | IBill)[];
  readonly unpaidInvoicesByContactId: Dictionary<
    (ISaleInvoice | IBill)[]
  >;
  protected periodsByContactId: {
    [key: number]: (IAgingPeriod & IAgingPeriodTotal)[];
  } = {};

  /**
   * Setes initial aging periods to the given customer id.
   * @param {number} customerId - Customer id.
   */
  protected setInitialAgingPeriods(contactId: number): void {
    this.periodsByContactId[contactId] = this.agingPeriods.map(
      (agingPeriod) => ({
        ...agingPeriod,
        ...this.formatTotalAmount(0),
      })
    );
  }

  /**
   * Calculates the given contact aging periods.
   * @param {ICustomer} customer
   * @return {(IAgingPeriod & IAgingPeriodTotal)[]}
   */
  protected getContactAgingPeriods(
    contactId: number
  ): (IAgingPeriod & IAgingPeriodTotal)[] {
    return defaultTo(this.periodsByContactId[contactId], []);
  }

  /**
   * Sets the customer aging due amount to the table.
   * @param {number} customerId - Customer id.
   * @param {number} dueAmount - Due amount.
   * @param {number} overdueDays - Overdue days.
   */
  protected setContactAgingDueAmount(
    customerId: number,
    dueAmount: number,
    overdueDays: number
  ): void {
    if (!this.periodsByContactId[customerId]) {
      this.setInitialAgingPeriods(customerId);
    }
    const agingPeriods = this.periodsByContactId[customerId];

    const newAgingPeriods = agingPeriods.map((agingPeriod) => {
      const isInAgingPeriod =
        agingPeriod.beforeDays < overdueDays &&
        agingPeriod.toDays > overdueDays;

      return {
        ...agingPeriod,
        total: isInAgingPeriod
          ? agingPeriod.total + dueAmount
          : agingPeriod.total,
      };
    });
    this.periodsByContactId[customerId] = newAgingPeriods;
  }

  /**
   * Retrieve the aging period total object.
   * @param {number} amount
   * @return {IAgingPeriodTotal}
   */
  protected formatTotalAmount(amount: number): IAgingPeriodTotal {
    return {
      total: amount,
      formattedTotal: this.formatNumber(amount),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Calculates the total of the aging period by the given index.
   * @param {number} index
   * @return {number}
   */
  protected getTotalAgingPeriodByIndex(index: number): number {
    return this.contacts.reduce((acc, customer) => {
      const periods = this.getContactAgingPeriods(customer.id);
      const totalPeriod = periods[index] ? periods[index].total : 0;

      return acc + totalPeriod;
    }, 0);
  }

  /**
   * Sets the initial aging periods to the all customers.
   */
  protected initContactsAgingPeriods(): void {
    this.contacts.forEach((contact) => {
      this.setInitialAgingPeriods(contact.id);
    });
  }

  /**
   * Retrieve the due invoices by the given customer id.
   * @param {number} customerId -
   * @return {ISaleInvoice[]}
   */
  protected getUnpaidInvoicesByContactId(
    contactId: number
  ): (ISaleInvoice | IBill)[] {
    return defaultTo(this.unpaidInvoicesByContactId[contactId], []);
  }

  /**
   * Retrieve total aging periods of the report.
   * @return {(IAgingPeriodTotal & IAgingPeriod)[]}
   */
  protected getTotalAgingPeriods(): (IAgingPeriodTotal & IAgingPeriod)[] {
    return this.agingPeriods.map((agingPeriod, index) => {
      const total = this.getTotalAgingPeriodByIndex(index);

      return {
        ...agingPeriod,
        ...this.formatTotalAmount(total),
      };
    });
  }

  /**
   * Sets customers invoices to aging periods.
   */
  protected calcUnpaidInvoicesAgingPeriods(): void {
    this.contacts.forEach((contact) => {
      const unpaidInvoices = this.getUnpaidInvoicesByContactId(contact.id);

      unpaidInvoices.forEach((unpaidInvoice) => {
        this.setContactAgingDueAmount(
          contact.id,
          unpaidInvoice.dueAmount,
          unpaidInvoice.overdueDays
        );
      });
    });
  }
}
