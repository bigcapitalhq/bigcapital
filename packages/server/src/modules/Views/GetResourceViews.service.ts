import { Injectable } from '@nestjs/common';
import { View } from './models/View.model';
import { ResourceService } from '../Resource/ResourceService';

@Injectable()
export class GetResourceViewsService {
  constructor(private readonly resourceService: ResourceService) {}
  /**
   * Listing resource views.
   * @param {string} resourceModel -
   */
  public async getResourceViews(resourceName: string): Promise<View[]> {
    // Validate the resource model name is valid.
    const resourceModel = this.resourceService.getResourceModel(resourceName);

    // Default views.
    const defaultViews = resourceModel().getDefaultViews();

    return defaultViews;
  }
}
