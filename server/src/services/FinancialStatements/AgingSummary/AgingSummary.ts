import { defaultTo, sumBy } from 'lodash';
import {
  IAgingPeriod,
  ISaleInvoice,
  IBill,
  IAgingPeriodTotal,
  IARAgingSummaryCustomer,
  IContact,
} from 'interfaces';
import AgingReport from './AgingReport';
import { Dictionary } from 'tsyringe/dist/typings/types';

export default abstract class AgingSummaryReport extends AgingReport {
  protected readonly contacts: IContact[];
  protected readonly agingPeriods: IAgingPeriod[] = [];
  protected readonly baseCurrency: string;
  protected readonly unpaidInvoices: (ISaleInvoice | IBill)[];
  protected readonly unpaidInvoicesByContactId: Dictionary<
    (ISaleInvoice | IBill)[]
  >;
  protected periodsByContactId: {
    [key: number]: (IAgingPeriod & IAgingPeriodTotal)[];
  } = {};

  /**
   * Setes initial aging periods to the given customer id.
   * @param {number} customerId - Customer id.
   */
  protected getInitialAgingPeriodsTotal() {
    return this.agingPeriods.map((agingPeriod) => ({
      ...agingPeriod,
      ...this.formatTotalAmount(0),
    }));
  }

  /**
   * Calculates the given contact aging periods.
   * @param {ICustomer} customer
   * @return {(IAgingPeriod & IAgingPeriodTotal)[]}
   */
  protected getContactAgingPeriods(
    contactId: number
  ): (IAgingPeriod & IAgingPeriodTotal)[] {
    const unpaidInvoices = this.getUnpaidInvoicesByContactId(contactId);
    const initialAgingPeriods = this.getInitialAgingPeriodsTotal();

    return unpaidInvoices.reduce((agingPeriods, unpaidInvoice) => {
      const newAgingPeriods = this.getContactAgingDueAmount(
        agingPeriods,
        unpaidInvoice.dueAmount,
        unpaidInvoice.overdueDays
      );
      return newAgingPeriods;
    }, initialAgingPeriods);
  }

  /**
   * Sets the customer aging due amount to the table. (Xx)
   * @param {number} customerId - Customer id.
   * @param {number} dueAmount - Due amount.
   * @param {number} overdueDays - Overdue days.
   */
  protected getContactAgingDueAmount(
    agingPeriods: any,
    dueAmount: number,
    overdueDays: number
  ): (IAgingPeriod & IAgingPeriodTotal)[] {
    const newAgingPeriods = agingPeriods.map((agingPeriod) => {
      const isInAgingPeriod =
        agingPeriod.beforeDays <= overdueDays &&
        (agingPeriod.toDays > overdueDays || !agingPeriod.toDays);

      return {
        ...agingPeriod,
        total: isInAgingPeriod
          ? agingPeriod.total + dueAmount
          : agingPeriod.total,
      };
    });
    return newAgingPeriods;
  }

  /**
   * Retrieve the aging period total object. (xx)
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
  protected getTotalAgingPeriodByIndex(
    contactsAgingPeriods: any,
    index: number
  ): number {
    return this.contacts.reduce((acc, customer) => {
      const totalPeriod = contactsAgingPeriods[index]
        ? contactsAgingPeriods[index].total
        : 0;

      return acc + totalPeriod;
    }, 0);
  }

  /**
   * Retrieve the due invoices by the given customer id. (XX)
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
  protected getTotalAgingPeriods(
    contactsAgingPeriods: IARAgingSummaryCustomer[]
  ): (IAgingPeriodTotal & IAgingPeriod)[] {
    return this.agingPeriods.map((agingPeriod, index) => {
      const total = sumBy(contactsAgingPeriods, `aging[${index}].total`);

      return {
        ...agingPeriod,
        ...this.formatTotalAmount(total),
      };
    });
  }
}
