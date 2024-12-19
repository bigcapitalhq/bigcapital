import { Injectable } from '@nestjs/common';
import { DynamicListAbstract } from './DynamicListAbstract';
import { ERRORS } from './constants';
import { DynamicFilterViews } from './DynamicFilter';
import { ServiceError } from '../Items/ServiceError';
import { BaseModel } from '@/models/Model';

@Injectable()
export class DynamicListCustomView extends DynamicListAbstract {
  /**
   * Retreive custom view or throws error not found.
   * @param {number} tenantId
   * @param {number} viewId
   * @return {Promise<IView>}
   */
  private getCustomViewOrThrowError = async (
    viewSlug: string,
    model: BaseModel,
  ) => {
    // Finds the default view by the given view slug.
    const defaultView = model.getDefaultViewBySlug(viewSlug);

    if (!defaultView) {
      throw new ServiceError(ERRORS.VIEW_NOT_FOUND);
    }
    return defaultView;
  };

  /**
   * Dynamic list custom view.
   * @param {IModel} model
   * @param {number} customViewId
   * @returns
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
