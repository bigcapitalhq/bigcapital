import { Service, Inject } from 'typedi';
import { camelCase, upperFirst } from 'lodash';
import * as qim from 'qim';
import pluralize from 'pluralize';
import { IModelMeta } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import I18nService from '@/services/I18n/I18nService';
import { tenantKnexConfig } from 'config/knexConfig';

const ERRORS = {
  RESOURCE_MODEL_NOT_FOUND: 'RESOURCE_MODEL_NOT_FOUND',
};

@Service()
export default class ResourceService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  i18nService: I18nService;

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

    // Retrieve the resource meta.
    const resourceMeta = resourceModel.getMeta(metakey);

    // Localization the fields names.
    return this.getResourceMetaLocalized(resourceMeta, tenantId);
  }

  /**
   * Retrieve the resource meta localized based on the current user language.
   */
  public getResourceMetaLocalized(meta, tenantId) {
    const $enumerationType = (field) =>
      field.fieldType === 'enumeration' ? field : undefined;

    const navigations = [
      ['fields', qim.$each, 'name'],
      ['fields', qim.$each, $enumerationType, 'options', qim.$each, 'label'],
    ];
    return this.i18nService.i18nApply(navigations, meta, tenantId);
  }
}
