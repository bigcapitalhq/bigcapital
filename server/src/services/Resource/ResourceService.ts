import { Service, Inject } from 'typedi';
import { camelCase, upperFirst } from 'lodash';
import pluralize from 'pluralize';
import { IModel } from 'interfaces';
import {
  getModelFields,
} from 'lib/ViewRolesBuilder'
import TenancyService from 'services/Tenancy/TenancyService';
import { ServiceError } from 'exceptions';

const ERRORS = {
  RESOURCE_MODEL_NOT_FOUND: 'RESOURCE_MODEL_NOT_FOUND',
};

@Service()
export default class ResourceService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Transform resource to model name.
   * @param {string} resourceName 
   */
  private resourceToModelName(resourceName: string): string {
    return upperFirst(camelCase(pluralize.singular(resourceName)));
  }

  /**
   * Retrieve model fields.
   * @param {number} tenantId 
   * @param {IModel} Model 
   */
  private getModelFields(tenantId: number, Model: IModel) {
    const { __ } = this.tenancy.i18n(tenantId);
    const fields = getModelFields(Model);

    return fields.map((field) => ({
      label: __(field.label, field.label),
      key: field.key,
      dataType: field.columnType,
    }));
  }

  /**
   * Retrieve resource fields from resource model name.
   * @param {string} resourceName 
   */
  public getResourceFields(tenantId: number, modelName: string) {
    const resourceModel = this.getResourceModel(tenantId, modelName);

    return this.getModelFields(tenantId, resourceModel);
  }

  /**
   * Retrieve resource model object.
   * @param {number} tenantId -
   * @param {string} inputModelName -
   */
  public getResourceModel(tenantId: number, inputModelName: string) {
    const modelName = this.resourceToModelName(inputModelName);
    const Models = this.tenancy.models(tenantId);

    if (!Models[modelName]) {
      throw new ServiceError(ERRORS.RESOURCE_MODEL_NOT_FOUND);
    }
    if (!Models[modelName].resourceable) {
      throw new ServiceError(ERRORS.RESOURCE_MODEL_NOT_FOUND);
    }
    return Models[modelName];
  }
}