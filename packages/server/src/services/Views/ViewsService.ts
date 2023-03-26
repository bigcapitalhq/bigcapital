import { Service, Inject } from 'typedi';
import {
  IViewsService,
  IView,
  IModel,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import ResourceService from '@/services/Resource/ResourceService';

@Service()
export default class ViewsService implements IViewsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  resourceService: ResourceService;

  /**
   * Listing resource views.
   * @param {number} tenantId -
   * @param {string} resourceModel -
   */
  public async listResourceViews(
    tenantId: number,
    resourceModelName: string
  ): Promise<IView[]> {
    // Validate the resource model name is valid.
    const resourceModel = this.getResourceModelOrThrowError(
      tenantId,
      resourceModelName
    );
    // Default views.
    const defaultViews = resourceModel.getDefaultViews();

    return defaultViews;
  }

  /**
   * Retrieve resource model from resource name or throw not found error.
   * @param {number} tenantId
   * @param {number} resourceModel
   */
  private getResourceModelOrThrowError(
    tenantId: number,
    resourceModel: string
  ): IModel {
    return this.resourceService.getResourceModel(tenantId, resourceModel);
  }
}
