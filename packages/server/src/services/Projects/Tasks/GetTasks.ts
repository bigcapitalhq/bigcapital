import { IProjectTaskGetPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { TaskTransformer } from './TaskTransformer';

@Service()
export class GetTasksService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the tasks list.
   * @param   {number} tenantId - Tenant Id.
   * @param   {number} taskId - Task Id.
   * @returns {}
   */
  public getTasks = async (
    tenantId: number,
    projectId: number
  ): Promise<IProjectTaskGetPOJO[]> => {
    const { Task } = this.tenancy.models(tenantId);

    // Retrieve the project.
    const tasks = await Task.query().where('projectId', projectId);

    // Transforms and returns object.
    return this.transformer.transform(tenantId, tasks, new TaskTransformer());
  };
}
