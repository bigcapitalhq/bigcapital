import { Transformer } from '@/lib/Transformer/Transformer';
import { sumBy } from 'lodash';
import Project from 'models/Project';
import { formatNumber } from 'utils';
import { formatMinutes } from 'utils/formatMinutes';

export class ProjectDetailedTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'costEstimateFormatted',
      'deadlineFormatted',
      'contactDisplayName',
      'statusFormatted',

      'totalActualHours',
      'totalActualHoursFormatted',
      'totalEstimateHours',
      'totalEstimateHoursFormatted',
      'totalInvoicedHours',
      'totalInvoicedHoursFormatted',
      'totalBillableHours',
      'totalBillableHoursFormatted',

      'totalActualHoursAmount',
      'totalActualHoursAmountFormatted',
      'totalEstimateHoursAmount',
      'totalEstimateHoursAmountFormatted',
      'totalInvoicedHoursAmount',
      'totalInvoicedHoursAmountFormatted',
      'totalBillableHoursAmount',
      'totalBillableHoursAmountFormatted',

      'totalExpenses',
      'totalExpensesFormatted',

      'totalInvoicedExpenses',
      'totalInvoicedExpensesFormatted',

      'totalBillableExpenses',
      'totalBillableExpensesFormatted',

      'totalInvoiced',
      'totalInvoicedFormatted',

      'totalBillable',
      'totalBillableFormatted',
    ];
  };

  /**
   * Exclude these attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['contact', 'tasks', 'expenses', 'bills'];
  };

  /**
   * Retrieves the formatted value of cost estimate.
   * @param {Project} project
   * @returns {string}
   */
  public costEstimateFormatted = (project: Project) => {
    return formatNumber(project.costEstimate, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted value of the deadline date.
   * @param {Project} project
   * @returns {string}
   */
  public deadlineFormatted = (project: Project) => {
    return this.formatDate(project.deadline);
  };

  /**
   * Retrieves the contact display name.
   * @param {Project} project
   * @returns {string}
   */
  public contactDisplayName = (project: Project) => {
    return project.contact.displayName;
  };

  /**
   * Retrieves the formatted value of project's status.
   * @param {Project} project
   * @returns {string}
   */
  public statusFormatted = (project: Project) => {
    return project.status;
  };

  // --------------------------------------------------------------
  // # Tasks Hours
  // --------------------------------------------------------------
  /**
   * Total actual hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalActualHours = (project: Project) => {
    return sumBy(project.tasks, 'totalActualHours');
  };

  /**
   * Retrieves the formatted total actual hours.
   * @param {Project} project
   * @returns {string}
   */
  public totalActualHoursFormatted = (project: Project) => {
    const hours = this.totalActualHours(project);
    return formatMinutes(hours);
  };

  /**
   * Total Estimated hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalEstimateHours = (project: Project) => {
    return sumBy(project.tasks, 'totalEstimateHours');
  };

  /**
   * Total estimate hours formatted.
   * @param {Project} project
   * @returns {string}
   */
  public totalEstimateHoursFormatted = (project: Project) => {
    const hours = this.totalEstimateHours(project);
    return formatMinutes(hours);
  };

  /**
   * Total invoiced hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalInvoicedHours = (project: Project) => {
    return sumBy(project.tasks, 'totalInvoicedHours');
  };

  /**
   * Total invoiced hours formatted.
   * @param {Project} project
   * @returns {string}
   */
  public totalInvoicedHoursFormatted = (project: Project) => {
    const hours = this.totalInvoicedHours(project);
    return formatMinutes(hours);
  };

  /**
   * Total billable hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalBillableHours = (project: Project) => {
    const totalActualHours = this.totalActualHours(project);
    const totalInvoicedHours = this.totalInvoicedHours(project);

    return Math.max(totalActualHours - totalInvoicedHours, 0);
  };

  /**
   * Retrieves the billable hours formatted.
   * @param {Project} project
   * @returns {string}
   */
  public totalBillableHoursFormatted = (project) => {
    const hours = this.totalBillableHours(project);
    return formatMinutes(hours);
  };

  // --------------------------------------------------------------
  // # Tasks Hours Amount
  // --------------------------------------------------------------
  /**
   * Total amount of invoiced hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalActualHoursAmount = (project: Project) => {
    return sumBy(project.tasks, 'totalActualAmount');
  };

  /**
   * Total amount of invoiced hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalActualHoursAmountFormatted = (project: Project) => {
    return formatNumber(this.totalActualHoursAmount(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Total amount of estimated hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalEstimateHoursAmount = (project: Project) => {
    return sumBy(project.tasks, 'totalEstimateAmount');
  };

  /**
   * Formatted amount of total estimate hours.
   * @param {Project} project
   * @returns {string}
   */
  public totalEstimateHoursAmountFormatted = (project: Project) => {
    return formatNumber(this.totalEstimateHoursAmount(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Total amount of invoiced hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalInvoicedHoursAmount = (project) => {
    return sumBy(project.tasks, 'totalInvoicedAmount');
  };

  /**
   * Formatted total amount of invoiced hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalInvoicedHoursAmountFormatted = (project) => {
    return formatNumber(this.totalInvoicedHoursAmount(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Total amount of billable hours.
   * @param {Project} project
   * @returns {number}
   */
  public totalBillableHoursAmount = (project) => {
    const totalActualAmount = this.totalActualHoursAmount(project);
    const totalBillableAmount = this.totalInvoicedHoursAmount(project);

    return Math.max(totalActualAmount, totalBillableAmount);
  };

  /**
   * Formatted total amount of billable hours.
   * @param {Project} project
   * @returns {string}
   */
  public totalBillableHoursAmountFormatted = (project) => {
    return formatNumber(this.totalBillableHoursAmount(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  // --------------------------------------------------------------
  // # Expenses
  // --------------------------------------------------------------
  /**
   * Total expenses amount.
   * @param {Project} project
   * @returns {number}
   */
  public totalExpenses = (project) => {
    const expensesTotal = sumBy(project.expenses, 'totalExpenses');
    const billsTotal = sumBy(project.bills, 'totalBills');

    return expensesTotal + billsTotal;
  };

  /**
   * Formatted total amount of expenses.
   * @param {Project} project
   * @returns {string}
   */
  public totalExpensesFormatted = (project) => {
    return formatNumber(this.totalExpenses(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Total amount of invoiced expenses.
   * @param {Project} project
   * @returns {number}
   */
  public totalInvoicedExpenses = (project: Project) => {
    const totalInvoicedExpenses = sumBy(
      project.expenses,
      'totalInvoicedExpenses'
    );
    const totalInvoicedBills = sumBy(project.bills, 'totalInvoicedBills');

    return totalInvoicedExpenses + totalInvoicedBills;
  };

  /**
   * Formatted total amount of invoiced expenses.
   * @param {Project} project
   * @returns {string}
   */
  public totalInvoicedExpensesFormatted = (project: Project) => {
    return formatNumber(this.totalInvoicedExpenses(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Total amount of billable expenses.
   * @param {Project} project
   * @returns {number}
   */
  public totalBillableExpenses = (project: Project) => {
    const totalInvoiced = this.totalInvoicedExpenses(project);
    const totalInvoice = this.totalExpenses(project);

    return totalInvoice - totalInvoiced;
  };

  /**
   * Formatted total amount of billable expenses.
   * @param {Project} project
   * @returns {string}
   */
  public totalBillableExpensesFormatted = (project: Project) => {
    return formatNumber(this.totalBillableExpenses(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  // --------------------------------------------------------------
  // # Total
  // --------------------------------------------------------------
  /**
   * Total invoiced amount.
   * @param {Project} project
   * @returns {number}
   */
  public totalInvoiced = (project: Project) => {
    const invoicedExpenses = this.totalInvoicedExpenses(project);
    const invoicedTasks = this.totalInvoicedHoursAmount(project);

    return invoicedExpenses + invoicedTasks;
  };

  /**
   * Formatted amount of total invoiced.
   * @param {Project} project
   * @returns {number}
   */
  public totalInvoicedFormatted = (project: Project) => {
    return formatNumber(this.totalInvoiced(project), {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Total billable amount.
   * @param {Project} project
   * @returns {number}
   */
  public totalBillable = (project: Project) => {
    const billableExpenses = this.totalBillableExpenses(project);
    const billableTasks = this.totalBillableHoursAmount(project);

    return billableExpenses + billableTasks;
  };

  /**
   * Formatted amount of billable total.
   * @param {Project} project
   * @returns {string}
   */
  public totalBillableFormatted = (project: Project) => {
    return formatNumber(this.totalBillable(project), {
      currencyCode: this.context.baseCurrency,
    });
  };
}
