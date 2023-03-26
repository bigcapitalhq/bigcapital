import { Inject, Service } from 'typedi';
import { flatten, includes, isEmpty } from 'lodash';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ProjectBillableBillTransformer } from './ProjectBillableBillTransformer';
import { ProjectBillableExpenseTransformer } from './ProjectBillableExpenseTransformer';
import { ProjectBillableTaskTransformer } from './ProjectBillableTaskTransformer';
import {
  ProjectBillableEntriesQuery,
  ProjectBillableEntry,
  ProjectBillableType,
} from '@/interfaces';
import { ProjectBillableGetter } from './_types';

@Service()
export default class GetProjectBillableEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Billable getter with type.
   * @get
   * @returns {ProjectBillableGetter[]}
   */
  get billableGetters(): ProjectBillableGetter[] {
    return [
      { type: ProjectBillableType.Task, getter: this.getProjectBillableTasks },
      {
        type: ProjectBillableType.Expense,
        getter: this.getProjectBillableExpenses,
      },
      { type: ProjectBillableType.Bill, getter: this.getProjectBillableBills },
    ];
  }

  /**
   * Retrieve the billable entries of the given project.
   * @param {number} tenantId
   * @param {number} projectId
   * @param {ProjectBillableEntriesQuery} query -
   * @returns {}
   */
  public getProjectBillableEntries = async (
    tenantId: number,
    projectId: number,
    query: ProjectBillableEntriesQuery = {
      billableType: [],
    }
  ): Promise<ProjectBillableEntry[]> => {
    const gettersOpers = this.billableGetters
      .filter(
        (billableGetter) =>
          includes(query.billableType, billableGetter.type) ||
          isEmpty(query.billableType)
      )
      .map((billableGetter) =>
        billableGetter.getter(tenantId, projectId, query)
      );
    const gettersResults = await Promise.all(gettersOpers);

    return flatten(gettersResults);
  };

  /**
   * Retrieves the billable tasks of the given project.
   * @param {number} tenantId
   * @param {number} projectId
   * @param {ProjectBillableEntriesQuery} query
   * @returns {ProjectBillableEntry[]}
   */
  private getProjectBillableTasks = async (
    tenantId: number,
    projectId: number,
    query: ProjectBillableEntriesQuery
  ): Promise<ProjectBillableEntry[]> => {
    const { Task } = this.tenancy.models(tenantId);

    const billableTasks = await Task.query().where('projectId', projectId);

    return this.transformer.transform(
      tenantId,
      billableTasks,
      new ProjectBillableTaskTransformer()
    );
  };

  /**
   * Retrieves the billable expenses of the given project.
   * @param {number} tenantId
   * @param {number} projectId
   * @param {ProjectBillableEntriesQuery} query
   * @returns
   */
  private getProjectBillableExpenses = async (
    tenantId: number,
    projectId: number,
    query: ProjectBillableEntriesQuery
  ) => {
    const { Expense } = this.tenancy.models(tenantId);

    const billableExpenses = await Expense.query()
      .where('projectId', projectId)
      .modify('filterByDateRange', null, query.toDate)
      .modify('filterByPublished');

    return this.transformer.transform(
      tenantId,
      billableExpenses,
      new ProjectBillableExpenseTransformer()
    );
  };

  /**
   * Retrieves billable bills of the given project.
   * @param {number} tenantId
   * @param {number} projectId
   * @param {ProjectBillableEntriesQuery} query
   */
  private getProjectBillableBills = async (
    tenantId: number,
    projectId: number,
    query: ProjectBillableEntriesQuery
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    const billableBills = await Bill.query()
      .where('projectId', projectId)
      .modify('published');

    return this.transformer.transform(
      tenantId,
      billableBills,
      new ProjectBillableBillTransformer()
    );
  };
}
