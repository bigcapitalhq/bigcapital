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
  IAgingAmount,
  IAgingSummaryContact,
} from '@/interfaces';
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
   * Sets initial aging periods to the contact.
   */
  protected getInitialAgingPeriodsTotal(): IAgingPeriodTotal[] {
    return this.agingPeriods.map((agingPeriod) => ({
      ...agingPeriod,
      total: this.formatAmount(0),
    }));
  }

  /**
   * Calculates the given contact aging periods.
   * @param {number} contactId - Contact id.
   * @return {IAgingPeriodTotal[]}
   */
  protected getContactAgingPeriods(contactId: number): IAgingPeriodTotal[] {
    const unpaidInvoices = this.getUnpaidInvoicesByContactId(contactId);
    const initialAgingPeriods = this.getInitialAgingPeriodsTotal();

    return unpaidInvoices.reduce(
      (agingPeriods: IAgingPeriodTotal[], unpaidInvoice) => {
        const newAgingPeriods = this.getContactAgingDueAmount(
          agingPeriods,
          unpaidInvoice.dueAmount,
          unpaidInvoice.overdueDays
        );
        return newAgingPeriods;
      },
      initialAgingPeriods
    );
  }

  /**
   * Sets the contact aging due amount to the table.
   * @param {IAgingPeriodTotal} agingPeriods - Aging periods.
   * @param {number} dueAmount - Due amount.
   * @param {number} overdueDays - Overdue days.
   * @return {IAgingPeriodTotal[]}
   */
  protected getContactAgingDueAmount(
    agingPeriods: IAgingPeriodTotal[],
    dueAmount: number,
    overdueDays: number
  ): IAgingPeriodTotal[] {
    const newAgingPeriods = agingPeriods.map((agingPeriod) => {
      const isInAgingPeriod =
        agingPeriod.beforeDays <= overdueDays &&
        (agingPeriod.toDays > overdueDays || !agingPeriod.toDays);

      const total: number = isInAgingPeriod
        ? agingPeriod.total.amount + dueAmount
        : agingPeriod.total.amount;

      return {
        ...agingPeriod,
        total: this.formatAmount(total),
      };
    });
    return newAgingPeriods;
  }

  /**
   * Retrieve the aging period total object.
   * @param {number} amount
   * @param {IFormatNumberSettings} settings - Override the format number settings.
   * @return {IAgingAmount}
   */
  protected formatAmount(
    amount: number,
    settings: IFormatNumberSettings = {}
  ): IAgingAmount {
    return {
      amount,
      formattedAmount: this.formatNumber(amount, settings),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the aging period total object.
   * @param {number} amount
   * @param {IFormatNumberSettings} settings - Override the format number settings.
   * @return {IAgingPeriodTotal}
   */
  protected formatTotalAmount(
    amount: number,
    settings: IFormatNumberSettings = {}
  ): IAgingAmount {
    return this.formatAmount(amount, {
      money: true,
      excerptZero: false,
      ...settings,
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
    return this.contacts.reduce((acc, contact) => {
      const totalPeriod = contactsAgingPeriods[index]
        ? contactsAgingPeriods[index].total
        : 0;

      return acc + totalPeriod;
    }, 0);
  }

  /**
   * Retrieve the due invoices by the given contact id.
   * @param  {number} contactId -
   * @return {(ISaleInvoice | IBill)[]}
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
  ): IAgingPeriodTotal[] {
    return this.agingPeriods.map((agingPeriod, index) => {
      const total = sumBy(
        contactsAgingPeriods,
        (summary: IARAgingSummaryCustomer) => {
          const aging = summary.aging[index];

          if (!aging) {
            return 0;
          }
          return aging.total.amount;
        }
      );

      return {
        ...agingPeriod,
        total: this.formatTotalAmount(total),
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
   * Retrieve to total sumation of the given contacts summeries sections.
   * @param {IARAgingSummaryCustomer[]} contactsSections -
   * @return {number}
   */
  protected getTotalCurrent(contactsSummaries: IAgingSummaryContact[]): number {
    return sumBy(contactsSummaries, (summary) => summary.current.amount);
  }

  /**
   * Retrieve the total of the given aging periods.
   * @param {IAgingPeriodTotal[]} agingPeriods
   * @return {number}
   */
  protected getAgingPeriodsTotal(agingPeriods: IAgingPeriodTotal[]): number {
    return sumBy(agingPeriods, (period) => period.total.amount);
  }

  /**
   * Retrieve total of contacts totals.
   * @param {IAgingSummaryContact[]} contactsSummaries
   */
  protected getTotalContactsTotals(
    contactsSummaries: IAgingSummaryContact[]
  ): number {
    return sumBy(contactsSummaries, (summary) => summary.total.amount);
  }
}
