import { IProjectGetPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ProjectDetailedTransformer } from './ProjectDetailedTransformer';

@Service()
export default class GetProject {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the project.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<IProjectGetPOJO>}
   */
  public getProject = async (
    tenantId: number,
    projectId: number
  ): Promise<IProjectGetPOJO> => {
    const { Project } = this.tenancy.models(tenantId);

    // Retrieve the project.
    const project = await Project.query()
      .findById(projectId)
      .withGraphFetched('contact')
      .modify('totalExpensesDetails')
      .modify('totalBillsDetails')
      .modify('totalTasksDetails')
      .throwIfNotFound();

    // Transforms and returns object.
    return this.transformer.transform(
      tenantId,
      project,
      new ProjectDetailedTransformer()
    );
  };
}
