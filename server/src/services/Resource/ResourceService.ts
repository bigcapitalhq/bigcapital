import { Service, Inject } from 'typedi';
import { camelCase, upperFirst } from 'lodash';
import pluralize from 'pluralize';
import { buildFilter } from 'objection-filter';
import { IModel, IModelMeta } from 'interfaces';
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
      label: __(field.label),
      key: field.key,
      dataType: field.columnType,
      fieldType: field.fieldType,

      ...(field.options) ? {
        options: field.options.map((option) => ({
          ...option, label: __(option.label),
        })),
      } : {},

      ...(field.optionsResource) ? {
        optionsResource: field.optionsResource,
        optionsKey: field.optionsKey,
        optionsLabel: field.optionsLabel,
      } : {},
    }));
  }

  /**
   * Should model be resource-able or throw service error.
   * @param {IModel} model 
   */
  private shouldModelBeResourceable(model: IModel) {
    if (!model.resourceable) {
      throw new ServiceError(ERRORS.RESOURCE_MODEL_NOT_FOUND);
    }
  }

  /**
   * Retrieve resource fields from resource model name.
   * @param {string} resourceName 
   */
  public getResourceFields(tenantId: number, modelName: string) {
    const resourceModel = this.getResourceModel(tenantId, modelName);
    this.shouldModelBeResourceable(resourceModel);

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
    return Models[modelName];
  }

  /**
   * Retrieve resource data from the storage based on the given query.
   * @param {number} tenantId 
   * @param {string} modelName 
   */
  public async getResourceData(tenantId: number, modelName: string, filter: any) {
    const resourceModel = this.getResourceModel(tenantId, modelName);
    this.shouldModelBeResourceable(resourceModel);

    return buildFilter(resourceModel).build(filter);
  }

  /**
   * Retrieve the resource meta.
   * @param {number} tenantId 
   * @param {string} modelName 
   * @returns {IModelMeta}
   */
  public getResourceMeta(tenantId: number, modelName: string): IModelMeta {
    const resourceModel = this.getResourceModel(tenantId, modelName);

    const settings = resourceModel.meta();

    return settings;
  }
}