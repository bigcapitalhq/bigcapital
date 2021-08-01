import { Inject, Service } from 'typedi';
import DynamicListAbstruct from './DynamicListAbstruct';
import DynamicFilterViews from 'lib/DynamicFilter/DynamicFilterViews';
import { ServiceError } from 'exceptions';
import HasTenancyService from 'services/Tenancy/TenancyService';
import {ERRORS } from './constants';
import { IModel }from 'interfaces';

@Service()
export default class DynamicListCustomView extends DynamicListAbstruct {
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
    viewId: number,
    model: IModel
  ) => {
    const { viewRepository } = this.tenancy.repositories(tenantId);
    const view = await viewRepository.findOneById(viewId, 'roles');

    if (!view || view.resourceModel !== model.name) {
      throw new ServiceError(ERRORS.VIEW_NOT_FOUND);
    }
    return view;
  };

  /**
   * Dynamic list custom view.
   * @param {IModel} model
   * @param {number} customViewId
   * @returns
   */
  public dynamicListCustomView = async (
    tenantId: number,
    model,
    customViewId: number
  ) => {
    const view = await this.getCustomViewOrThrowError(
      tenantId,
      customViewId,
      model
    );
    return new DynamicFilterViews(view);
  };
}
