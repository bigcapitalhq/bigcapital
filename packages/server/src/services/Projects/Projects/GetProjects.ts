import { IProjectGetPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ProjectDetailedTransformer } from './ProjectDetailedTransformer';

@Service()
export default class GetProjects {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the projects list.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<IProjectGetPOJO[]>}
   */
  public getProjects = async (tenantId: number): Promise<IProjectGetPOJO[]> => {
    const { Project } = this.tenancy.models(tenantId);

    // Retrieve projects.
    const projects = await Project.query()
      .withGraphFetched('contact')
      .modify('totalExpensesDetails')
      .modify('totalBillsDetails')
      .modify('totalTasksDetails');

    // Transforms and returns object.
    return this.transformer.transform(
      tenantId,
      projects,
      new ProjectDetailedTransformer()
    );
  };
}
