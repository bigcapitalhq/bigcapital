import { Inject, Service } from 'typedi';
import { IProjectTimeGetPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TimeTransformer } from './TimeTransformer';

@Service()
export class GetTimelineService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the tasks list.
   * @param {number} tenantId - Tenant Id.
   * @param {number} taskId - Task Id.
   * @returns {Promise<IProjectTimeGetPOJO[]>}
   */
  public getTimeline = async (
    tenantId: number,
    projectId: number
  ): Promise<IProjectTimeGetPOJO[]> => {
    const { Time } = this.tenancy.models(tenantId);

    // Retrieve the project.
    const times = await Time.query()
      .where('projectId', projectId)
      .withGraphFetched('project.contact')
      .withGraphFetched('task');

    // Transforms and returns object.
    return this.transformer.transform(tenantId, times, new TimeTransformer());
  };
}
