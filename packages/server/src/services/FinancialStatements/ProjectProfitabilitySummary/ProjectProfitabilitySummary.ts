import { sumBy } from 'lodash';
import { map } from 'lodash/fp';
import {
  IProjectProfitabilitySummaryProjectNode,
  IProjectProfitabilitySummaryTotal,
} from '@/interfaces';
import Project from 'models/Project';
import { ProjectProfitabilitySummaryRepository } from './ProjectProfitabilitySummaryRepository';
import FinancialSheet from '../FinancialSheet';

export class ProfitProfitabilitySummary extends FinancialSheet {
  private readonly repository: ProjectProfitabilitySummaryRepository;
  private readonly baseCurrency: string;

  /**
   * Constructor method.
   * @param {ProjectProfitabilitySummaryRepository} repository
   * @param {string} baseCurrency
   */
  constructor(
    repository: ProjectProfitabilitySummaryRepository,
    baseCurrency: string
  ) {
    super();

    this.repository = repository;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Retrieves the project income node.
   * @param {number} projectId
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectIncomeNode = (
    projectId: number
  ): IProjectProfitabilitySummaryTotal => {
    const amount = this.repository.incomeLedger
      .whereProject(projectId)
      .getClosingBalance();

    const formattedAmount = this.formatNumber(amount);

    return {
      amount,
      formattedAmount,
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieves the project expense node.
   * @param   {number} projectId
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectExpenseNode = (
    projectId: number
  ): IProjectProfitabilitySummaryTotal => {
    const amount = this.repository.expenseLedger
      .whereProject(projectId)
      .getClosingBalance();

    const formattedAmount = this.formatNumber(amount);

    return {
      amount,
      formattedAmount,
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieves the project profit total node.
   * @param {number} projectId - Project id.
   * @returns {number}
   */
  private getProjectProfitTotal = (projectId: number): number => {
    const incomeTotal = this.repository.incomeLedger
      .whereProject(projectId)
      .getClosingBalance();

    const expenseTotal = this.repository.expenseLedger
      .whereProject(projectId)
      .getClosingBalance();

    return incomeTotal - expenseTotal;
  };

  /**
   * Retrieves the project profit node.
   * @param {number} projectId - Project id.
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectProfitNode = (
    projectId: number
  ): IProjectProfitabilitySummaryTotal => {
    const amount = this.getProjectProfitTotal(projectId);
    const formattedAmount = this.formatNumber(amount);

    return {
      amount,
      formattedAmount,
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieves the project node.
   * @param {Project} project
   * @returns {IProjectProfitabilitySummaryProjectNode}
   */
  private getProjectNode = (
    project: Project
  ): IProjectProfitabilitySummaryProjectNode => {
    return {
      projectId: project.id,
      projectName: project.name,
      projectStatus: 1,

      customerName: project.contact.displayName,
      customerId: project.contact.id,

      profit: this.getProjectProfitNode(project.id),
      income: this.getProjectIncomeNode(project.id),
      expenses: this.getProjectExpenseNode(project.id),
    };
  };

  /**
   * Retrieves the projects nodes.
   * @returns {IProjectProfitabilitySummaryProjectNode[]}
   */
  private getProjectsNode = (): IProjectProfitabilitySummaryProjectNode[] => {
    return map(this.getProjectNode)(this.repository.projects);
  };

  /**
   * Retrieves the all projects total income node.
   * @param {IProjectProfitabilitySummaryProjectNode[]} projects
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectsTotalIncomeNode = (
    projects: IProjectProfitabilitySummaryProjectNode[]
  ): IProjectProfitabilitySummaryTotal => {
    const amount = sumBy(projects, 'income.amount');
    const formattedAmount = this.formatTotalNumber(amount);

    return {
      amount,
      formattedAmount,
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieves the all projects expenses total node.
   * @param {IProjectProfitabilitySummaryProjectNode[]} projects
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectsTotalExpensesNode = (
    projects: IProjectProfitabilitySummaryProjectNode[]
  ): IProjectProfitabilitySummaryTotal => {
    const amount = sumBy(projects, 'expenses.amount');
    const formattedAmount = this.formatTotalNumber(amount);

    return {
      amount,
      formattedAmount,
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieves the all projects profit total node.
   * @param {IProjectProfitabilitySummaryProjectNode[]} projects
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectsTotalProfitNode = (
    projects: IProjectProfitabilitySummaryProjectNode[]
  ) => {
    const amount = sumBy(projects, 'profit.amount');
    const formattedAmount = this.formatTotalNumber(amount);

    return {
      amount,
      formattedAmount,
      currencyCode: this.baseCurrency,
    };
  };

  /**
   * Retrieves the all projects total node.
   * @param {IProjectProfitabilitySummaryProjectNode[]} projects
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  private getProjectsTotalNode = (
    projects: IProjectProfitabilitySummaryProjectNode[]
  ) => {
    const income = this.getProjectsTotalIncomeNode(projects);
    const expenses = this.getProjectsTotalExpensesNode(projects);
    const profit = this.getProjectsTotalProfitNode(projects);

    return { income, expenses, profit };
  };

  /**
   * Retrieves the report data.
   * @returns {IProjectProfitabilitySummaryTotal}
   */
  public getReportData = () => {
    const projects = this.getProjectsNode();
    const total = this.getProjectsTotalNode(projects);

    return { projects, total };
  };
}
