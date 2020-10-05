import { Service, Inject } from 'typedi';
import { camelCase, upperFirst } from 'lodash'
import { IModel } from 'interfaces';
import resourceFieldsKeys from 'data/ResourceFieldsKeys';
import TenancyService from 'services/Tenancy/TenancyService';

@Service()
export default class ResourceService {
  @Inject()
  tenancy: TenancyService;

  /**
   * 
   * @param {string} resourceName 
   */
  getResourceFieldsRelations(modelName: string) {
    const fieldsRelations = resourceFieldsKeys[modelName];

    if (!fieldsRelations) {
      throw new Error('Fields relation not found in thte given resource model.');
    }
    return fieldsRelations;
  }

  /**
   * Transform resource to model name.
   * @param {string} resourceName 
   */
  private resourceToModelName(resourceName: string): string {
    return upperFirst(camelCase(resourceName));
  }

  /**
   * Retrieve model from resource name in specific tenant.
   * @param {number} tenantId 
   * @param {string} resourceName 
   */
  public getModel(tenantId: number, resourceName: string) {
    const models = this.tenancy.models(tenantId);
    const modelName = this.resourceToModelName(resourceName);

    return models[modelName];
  }
 
  getModelFields(Model: IModel) {
    const fields = Object.keys(Model.fields);

    return fields.sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });
  }

  /**
   * 
   * @param {string} resourceName 
   */
  getResourceFields(Model: IModel) {
    console.log(Model);

    if (Model.resourceable) {
      return this.getModelFields(Model);
    }
    return [];
  }

  /**
   * 
   * @param {string} resourceName 
   */
  getResourceColumns(Model: IModel) {
    if (Model.resourceable) {
      return this.getModelFields(Model);
    }
    return [];
  }
}