import { Service, Inject } from 'typedi';
import { camelCase, upperFirst } from 'lodash';
import pluralize from 'pluralize';
import { buildFilter } from 'objection-filter';
import { IModel, IModelMeta } from 'interfaces';
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
   * Retrieve the resource meta.
   * @param {number} tenantId
   * @param {string} modelName
   * @returns {IModelMeta}
   */
  public getResourceMeta(
    tenantId: number,
    modelName: string,
    metakey?: string
  ): IModelMeta {
    const resourceModel = this.getResourceModel(tenantId, modelName);
    return resourceModel.getMeta(metakey);
  }
}
