import { Resource } from 'models';
import BaseModelRepository from 'repositories/BaseModelRepository';

export default class ResourceRepository extends BaseModelRepository{

  static async isExistsByName(name) {
    const resourceNames = Array.isArray(name) ? name : [name];
    const foundResources = await Resource.tenant().query().whereIn('name', resourceNames);

    return foundResources.length > 0;
  }
}