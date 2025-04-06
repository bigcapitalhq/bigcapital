import { Injectable } from '@nestjs/common';
import { ERRORS } from './constants';
import { DynamicFilterViews } from './DynamicFilter';
import { ServiceError } from '../Items/ServiceError';
import { DynamicListServiceAbstract } from './DynamicListServiceAbstract';
import { IView } from '../Views/Views.types';
import { MetableModel } from './types/DynamicList.types';

@Injectable()
export class DynamicListCustomView extends DynamicListServiceAbstract {
  /**
   * Retreive custom view or throws error not found.
   * @param {string} viewSlug - View slug.
   * @param {MetableModel} model - Metable model.
   * @return {Promise<IView>}
   */
  private async getCustomViewOrThrowError(
    viewSlug: string,
    model: MetableModel,
  ): Promise<IView> {
    // Finds the default view by the given view slug.
    const defaultView = model.getDefaultViewBySlug(viewSlug);

    if (!defaultView) {
      throw new ServiceError(ERRORS.VIEW_NOT_FOUND);
    }
    return defaultView;
  }

  /**
   * Dynamic list custom view.
   * @param {DynamicFilter} dynamicFilter - Dynamic filter.
   * @param {string} customViewSlug - Custom view slug.
   * @returns {DynamicFilterRoleAbstractor}
   */
  public dynamicListCustomView = async (
    dynamicFilter: any,
    customViewSlug: string,
  ) => {
    const model = dynamicFilter.getModel();

    // Retrieve the custom view or throw not found.
    const view = await this.getCustomViewOrThrowError(customViewSlug, model);

    return new DynamicFilterViews(view);
  };
}
