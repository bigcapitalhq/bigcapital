import { Inject, Service } from 'typedi';
import DynamicListAbstract from './DynamicListAbstract';
import DynamicFilterViews from '@/lib/DynamicFilter/DynamicFilterViews';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { IModel } from '@/interfaces';

@Service()
export default class DynamicListCustomView extends DynamicListAbstract {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retreive custom view or throws error not found.
   * @param  {number} tenantId
   * @param  {number} viewId
   * @return {Promise<IView>}
   */
  private getCustomViewOrThrowError = async (
    tenantId: number,
    viewSlug: string,
    model: IModel
  ) => {
    const { View } = this.tenancy.models(tenantId);

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
    tenantId: number
  ) => {
    const model = dynamicFilter.getModel();

    // Retrieve the custom view or throw not found.
    const view = await this.getCustomViewOrThrowError(
      tenantId,
      customViewSlug,
      model,
    );
    return new DynamicFilterViews(view);
  };
}
