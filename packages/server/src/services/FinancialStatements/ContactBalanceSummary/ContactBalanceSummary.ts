import { sumBy, isEmpty } from 'lodash';
import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import {
  IContactBalanceSummaryContact,
  IContactBalanceSummaryTotal,
  IContactBalanceSummaryAmount,
  IContactBalanceSummaryPercentage,
  ILedger,
  IContactBalanceSummaryQuery,
} from '@/interfaces';
import { allPassedConditionsPass } from 'utils';

export class ContactBalanceSummaryReport extends FinancialSheet {
  readonly baseCurrency: string;
  readonly ledger: ILedger;
  readonly filter: IContactBalanceSummaryQuery;

  /**
   * Calculates the contact percentage of column.
   * @param   {number} customerBalance - Contact balance.
   * @param   {number} totalBalance - Total contacts balance.
   * @returns {number}
   */
  protected getContactPercentageOfColumn = (
    customerBalance: number,
    totalBalance: number
  ): number => {
    return totalBalance / customerBalance;
  };

  /**
   * Retrieve the contacts total.
   * @param   {IContactBalanceSummaryContact} contacts
   * @returns {number}
   */
  protected getContactsTotal = (
    contacts: IContactBalanceSummaryContact[]
  ): number => {
    return sumBy(
      contacts,
      (contact: IContactBalanceSummaryContact) => contact.total.amount
    );
  };

  /**
   * Assoc total percentage of column.
   * @param {IContactBalanceSummaryTotal} node
   * @returns {IContactBalanceSummaryTotal}
   */
  protected assocTotalPercentageOfColumn = (
    node: IContactBalanceSummaryTotal
  ): IContactBalanceSummaryTotal => {
    return R.assoc('percentageOfColumn', this.getPercentageMeta(1), node);
  };

  /**
   * Retrieve the contacts total section.
   * @param   {IContactBalanceSummaryContact[]} contacts
   * @returns {IContactBalanceSummaryTotal}
   */
  protected getContactsTotalSection = (
    contacts: IContactBalanceSummaryContact[]
  ): IContactBalanceSummaryTotal => {
    const customersTotal = this.getContactsTotal(contacts);
    const node = {
      total: this.getTotalFormat(customersTotal),
    };
    return R.compose(
      R.when(
        R.always(this.filter.percentageColumn),
        this.assocTotalPercentageOfColumn
      )
    )(node);
  };

  /**
   * Retrieve the contact summary section with percentage of column.
   * @param   {number} total
   * @param   {IContactBalanceSummaryContact} contact
   * @returns {IContactBalanceSummaryContact}
   */
  private contactComparisonPercentageOfColumnMapper = (
    total: number,
    contact: IContactBalanceSummaryContact
  ): IContactBalanceSummaryContact => {
    const amount = this.getContactPercentageOfColumn(
      total,
      contact.total.amount
    );
    return {
      ...contact,
      percentageOfColumn: this.getPercentageMeta(amount),
    };
  };

  /**
   * Maps the contacts summary sections with percentage of column.
   * @param  {IContactBalanceSummaryContact[]} contacts -
   * @return {IContactBalanceSummaryContact[]}
   */
  protected contactComparisonPercentageOfColumn = (
    contacts: IContactBalanceSummaryContact[]
  ): IContactBalanceSummaryContact[] => {
    const customersTotal = this.getContactsTotal(contacts);
    const comparisonPercentageOfColumn = R.curry(
      this.contactComparisonPercentageOfColumnMapper
    )(customersTotal);

    return contacts.map(comparisonPercentageOfColumn);
  };

  /**
   * Retrieve the contact total format.
   * @param  {number} amount -
   * @return {IContactBalanceSummaryAmount}
   */
  protected getContactTotalFormat = (
    amount: number
  ): IContactBalanceSummaryAmount => {
    return {
      amount,
      formattedAmount: this.formatNumber(amount, { money: true }),
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieve the total amount of contacts sections.
   * @param   {number} amount
   * @returns {IContactBalanceSummaryAmount}
   */
  protected getTotalFormat = (amount: number): IContactBalanceSummaryAmount => {
    return {
      amount,
      formattedAmount: this.formatTotalNumber(amount, { money: true }),
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieve the percentage amount object.
   * @param   {number} amount
   * @returns {IContactBalanceSummaryPercentage}
   */
  protected getPercentageMeta = (
    amount: number
  ): IContactBalanceSummaryPercentage => {
    return {
      amount,
      formattedAmount: this.formatPercentage(amount),
    };
  };

  /**
   * Filters customer has none transactions.
   * @param {ICustomerBalanceSummaryCustomer} customer -
   * @returns {boolean}
   */
  private filterContactNoneTransactions = (
    contact: IContactBalanceSummaryContact
  ): boolean => {
    const entries = this.ledger.whereContactId(contact.id).getEntries();

    return !isEmpty(entries);
  };

  /**
   * Filters the customer that has zero total amount.
   * @param   {ICustomerBalanceSummaryCustomer} customer
   * @returns {boolean}
   */
  private filterContactNoneZero = (
    node: IContactBalanceSummaryContact
  ): boolean => {
    return node.total.amount !== 0;
  };

  /**
   * Filters the given customer node;
   * @param {ICustomerBalanceSummaryCustomer} customer
   */
  private contactNodeFilter = (contact: IContactBalanceSummaryContact) => {
    const { noneTransactions, noneZero } = this.filter;

    // Conditions pair filter determiner.
    const condsPairFilters = [
      [noneTransactions, this.filterContactNoneTransactions],
      [noneZero, this.filterContactNoneZero],
    ];
    return allPassedConditionsPass(condsPairFilters)(contact);
  };

  /**
   * Filters the given customers nodes.
   * @param   {ICustomerBalanceSummaryCustomer[]} nodes
   * @returns {ICustomerBalanceSummaryCustomer[]}
   */
  protected contactsFilter = (
    nodes: IContactBalanceSummaryContact[]
  ): IContactBalanceSummaryContact[] => {
    return nodes.filter(this.contactNodeFilter);
  };
}
