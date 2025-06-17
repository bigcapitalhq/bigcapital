import { Injectable } from '@nestjs/common';
import { View } from './models/View.model';
import { ResourceService } from '../Resource/ResourceService';
import { I18nService } from 'nestjs-i18n';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { GetResourceViewTransformer } from './GetResourceView.transformer';

@Injectable()
export class GetResourceViewsService {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly transformerInjectable: TransformerInjectable,
  ) {}

  /**
   * Listing resource views.
   * @param {string} resourceModel -
   */
  public async getResourceViews(resourceName: string): Promise<View[]> {
    // Validate the resource model name is valid.
    const resourceModel = this.resourceService.getResourceModel(resourceName);

    // Default views.
    const defaultViews = resourceModel().getDefaultViews();

    return this.transformerInjectable.transform(
      defaultViews,
      new GetResourceViewTransformer(),
    );
  }
}
