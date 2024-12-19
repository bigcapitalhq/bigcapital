import { Injectable } from '@nestjs/common';
import ResourceService from '@/services/Resource/ResourceService';
import { BaseModel } from '@/models/Model';
import { View } from './models/View.model';

@Injectable()
export class GetResourceViewsService {
  constructor(private readonly resourceService: ResourceService) {}
  /**
   * Listing resource views.
   * @param {number} tenantId -
   * @param {string} resourceModel -
   */
  public async getResourceViews(resourceName: string): Promise<View[]> {
    // Validate the resource model name is valid.
    const resourceModel = this.resourceService.getResourceModel(resourceName);

    // Default views.
    const defaultViews = resourceModel.getDefaultViews();

    return defaultViews;
  }
}
