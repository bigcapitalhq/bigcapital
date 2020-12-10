import { IView } from 'interfaces';
import TenantRepository from 'repositories/TenantRepository';

export default class ViewRepository extends TenantRepository {

  /**
   * Retrieve view model by the given id.
   * @param {number} id -
   */
  getById(id: number) {
    const { View } = this.models;
    return this.cache.get(`customView.id.${id}`, () => {
      return View.query().findById(id)
        .withGraphFetched('columns')
        .withGraphFetched('roles');
    });
  }

  /**
   * Retrieve all views of the given resource id.
   */
  allByResource(resourceModel: string) {
    const { View } = this.models;
    return this.cache.get(`customView.resourceModel.${resourceModel}`, () => {
      return View.query().where('resource_model', resourceModel)
        .withGraphFetched('columns')
        .withGraphFetched('roles');
    });
  }

  /**
   * Inserts a new view to the storage.
   * @param {IView} view 
   */
  async insert(view: IView): Promise<IView> {
    const { View } = this.models;
    const insertedView = await View.query().insertGraph({ ...view });
    this.flushCache();

    return insertedView;
  }

  async update(viewId: number, view: IView): Promise<IView> {
    const { View } = this.models;
    const updatedView = await View.query().upsertGraph({
      id: viewId,
      ...view
    });
    this.flushCache();

    return updatedView;
  }

  /**
   * Flushes repository cache.
   */
  flushCache() {
    this.cache.delStartWith('customView');
  }
}