import { IProjectTaskGetPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { TaskTransformer } from './TaskTransformer';

@Service()
export class GetTaskService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the tasks list.
   * @param {number} tenantId - Tenant Id.
   * @param {number} taskId - Task Id.
   * @returns {Promise<IProjectTaskGetPOJO>}
   */
  public getTask = async (
    tenantId: number,
    taskId: number
  ): Promise<IProjectTaskGetPOJO> => {
    const { Task } = this.tenancy.models(tenantId);

    // Retrieve the project.
    const task = await Task.query().findById(taskId).throwIfNotFound();

    // Transforms and returns object.
    return this.transformer.transform(tenantId, task, new TaskTransformer());
  };
}
