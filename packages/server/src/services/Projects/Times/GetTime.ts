import { IProjectTimeGetPOJO } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { TimeTransformer } from './TimeTransformer';

@Service()
export class GetTimeService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the tasks list.
   * @param {number} tenantId - Tenant Id.
   * @param {number} taskId - Task Id.
   * @returns {Promise<IProjectTimeGetPOJO>}
   */
  public getTime = async (
    tenantId: number,
    timeId: number
  ): Promise<IProjectTimeGetPOJO> => {
    const { Time } = this.tenancy.models(tenantId);

    // Retrieve the project.
    const time = await Time.query()
      .findById(timeId)
      .withGraphFetched('project.contact')
      .withGraphFetched('task')
      .throwIfNotFound();

    // Transforms and returns object.
    return this.transformer.transform(tenantId, time, new TimeTransformer());
  };
}
