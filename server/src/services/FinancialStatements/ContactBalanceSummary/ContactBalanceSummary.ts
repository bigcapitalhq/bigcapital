import { sumBy } from 'lodash';
import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import {
  IContactBalanceSummaryContact,
  IContactBalanceSummaryTotal,
  IContactBalanceSummaryAmount,
  IContactBalanceSummaryPercentage,
} from 'interfaces';

export class ContactBalanceSummaryReport extends FinancialSheet {
  readonly baseCurrency: string;

  /**
   * Calculates the contact percentage of column.
   * @param {number} customerBalance - Contact balance.
   * @param {number} totalBalance - Total contacts balance.
   * @returns {number}
   */
  protected getContactPercentageOfColumn(
    customerBalance: number,
    totalBalance: number
  ): number {
    return customerBalance > 0 ? totalBalance / customerBalance : 0;
  }

  /**
   * Retrieve the contacts total.
   * @param {IContactBalanceSummaryContact} contacts
   * @returns {number}
   */
  protected getContactsTotal(
    contacts: IContactBalanceSummaryContact[]
  ): number {
    return sumBy(
      contacts,
      (contact: IContactBalanceSummaryContact) => contact.total.amount
    );
  }

  /**
   * Retrieve the contacts total section.
   * @param {IContactBalanceSummaryContact[]} contacts
   * @returns {IContactBalanceSummaryTotal}
   */
  protected getContactsTotalSection(
    contacts: IContactBalanceSummaryContact[]
  ): IContactBalanceSummaryTotal {
    const customersTotal = this.getContactsTotal(contacts);

    return {
      total: this.getTotalFormat(customersTotal),
      percentageOfColumn: this.getPercentageMeta(1),
    };
  }

  /**
   * Retrieve the contact summary section with percentage of column.
   * @param {number} total
   * @param {IContactBalanceSummaryContact} contact
   * @returns {IContactBalanceSummaryContact}
   */
  private contactCamparsionPercentageOfColumnMapper(
    total: number,
    contact: IContactBalanceSummaryContact
  ): IContactBalanceSummaryContact {
    const amount = this.getContactPercentageOfColumn(
      total,
      contact.total.amount
    );
    return {
      ...contact,
      percentageOfColumn: this.getPercentageMeta(amount),
    };
  }

  /**
   * Mappes the contacts summary sections with percentage of column.
   * @param {IContactBalanceSummaryContact[]} contacts -
   * @return {IContactBalanceSummaryContact[]}
   */
  protected contactCamparsionPercentageOfColumn(
    contacts: IContactBalanceSummaryContact[]
  ): IContactBalanceSummaryContact[] {
    const customersTotal = this.getContactsTotal(contacts);
    const camparsionPercentageOfColummn = R.curry(
      this.contactCamparsionPercentageOfColumnMapper.bind(this)
    )(customersTotal);

    return contacts.map(camparsionPercentageOfColummn);
  }

  /**
   * Retrieve the contact total format.
   * @param {number} amount -
   * @return {IContactBalanceSummaryAmount}
   */
  protected getContactTotalFormat(
    amount: number
  ): IContactBalanceSummaryAmount {
    return {
      amount,
      formattedAmount: this.formatNumber(amount),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the total amount of contacts sections.
   * @param {number} amount
   * @returns {IContactBalanceSummaryAmount}
   */
  protected getTotalFormat(amount: number): IContactBalanceSummaryAmount {
    return {
      amount,
      formattedAmount: this.formatNumber(amount),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the percentage amount object.
   * @param {number} amount
   * @returns {IContactBalanceSummaryPercentage}
   */
  protected getPercentageMeta(
    amount: number
  ): IContactBalanceSummaryPercentage {
    return {
      amount,
      formattedAmount: this.formatPercentage(amount),
    };
  }
}
