import { defaultTo, sumBy, get } from 'lodash';
import {
  IAgingPeriod,
  ISaleInvoice,
  IBill,
  IAgingPeriodTotal,
  IARAgingSummaryCustomer,
  IContact,
  IARAgingSummaryQuery,
  IFormatNumberSettings,
} from 'interfaces';
import AgingReport from './AgingReport';
import { Dictionary } from 'tsyringe/dist/typings/types';

export default abstract class AgingSummaryReport extends AgingReport {
  protected readonly contacts: IContact[];
  protected readonly agingPeriods: IAgingPeriod[] = [];
  protected readonly baseCurrency: string;
  protected readonly query: IARAgingSummaryQuery;
  protected readonly overdueInvoicesByContactId: Dictionary<
    (ISaleInvoice | IBill)[]
  >;
  protected readonly currentInvoicesByContactId: Dictionary<
    (ISaleInvoice | IBill)[]
  >;

  /**
   * Setes initial aging periods to the given customer id.
   * @param {number} customerId - Customer id.
   */
  protected getInitialAgingPeriodsTotal() {
    return this.agingPeriods.map((agingPeriod) => ({
      ...agingPeriod,
      ...this.formatAmount(0),
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
        unpaidInvoice.getOverdueDays(this.query.asDate)
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
      
      const total = isInAgingPeriod
        ? agingPeriod.total + dueAmount
        : agingPeriod.total;

      return {
        ...agingPeriod,
        total,
      };
    });
    return newAgingPeriods;
  }

  /**
   * Retrieve the aging period total object.
   * @param {number} amount
   * @return {IAgingPeriodTotal}
   */
  protected formatAmount(
    amount: number,
    settings: IFormatNumberSettings = {}
  ): IAgingPeriodTotal {
    return {
      total: amount,
      formattedTotal: this.formatNumber(amount, settings),
      currencyCode: this.baseCurrency,
    };
  }

  protected formatTotalAmount(
    amount: number,
    settings: IFormatNumberSettings = {}
  ): IAgingPeriodTotal {
    return this.formatAmount(amount, {
      money: true,
      excerptZero: false,
      ...settings
    });
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
   * Retrieve the due invoices by the given customer id.
   * @param  {number} customerId -
   * @return {ISaleInvoice[]}
   */
  protected getUnpaidInvoicesByContactId(
    contactId: number
  ): (ISaleInvoice | IBill)[] {
    return defaultTo(this.overdueInvoicesByContactId[contactId], []);
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

  /**
   * Retrieve the current invoices by the given contact id.
   * @param {number} contactId - Specific contact id.
   * @return {(ISaleInvoice | IBill)[]}
   */
  protected getCurrentInvoicesByContactId(
    contactId: number
  ): (ISaleInvoice | IBill)[] {
    return get(this.currentInvoicesByContactId, contactId, []);
  }

  /**
   * Retrieve the contact total due amount.
   * @param {number} contactId - Specific contact id.
   * @return {number}
   */
  protected getContactCurrentTotal(contactId: number): number {
    const currentInvoices = this.getCurrentInvoicesByContactId(contactId);
    return sumBy(currentInvoices, (invoice) => invoice.dueAmount);
  }

  /**
   * Retrieve to total sumation of the given customers sections.
   * @param {IARAgingSummaryCustomer[]} contactsSections -
   * @return {number}
   */
  protected getTotalCurrent(
    customersSummary: IARAgingSummaryCustomer[]
  ): number {
    return sumBy(customersSummary, (summary) => summary.current.total);
  }

  /**
   * Retrieve the total of the given aging periods.
   * @param {IAgingPeriodTotal[]} agingPeriods
   * @return {number}
   */
  protected getAgingPeriodsTotal(agingPeriods: IAgingPeriodTotal[]): number {
    return sumBy(agingPeriods, 'total');
  }


  protected getTotalContactsTotals(
    customersSummary: IARAgingSummaryCustomer[]
  ): number {
    return sumBy(customersSummary, (summary) => summary.total.total);
  }
}
