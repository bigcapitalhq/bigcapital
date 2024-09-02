import { Service, Inject } from 'typedi';
import { camelCase, upperFirst, pickBy, isEmpty } from 'lodash';
import * as qim from 'qim';
import pluralize from 'pluralize';
import {
  Features,
  IModelMeta,
  IModelMetaField,
  IModelMetaField2,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import I18nService from '@/services/I18n/I18nService';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { BranchesSettings } from '../Branches/BranchesSettings';

const ERRORS = {
  RESOURCE_MODEL_NOT_FOUND: 'RESOURCE_MODEL_NOT_FOUND',
};

@Service()
export default class ResourceService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  i18nService: I18nService;

  @Inject()
  private branchesSettings: BranchesSettings;

  @Inject()
  private warehousesSettings: WarehousesSettings;

  /**
   * Transform resource to model name.
   * @param {string} resourceName
   */
  public resourceToModelName(resourceName: string): string {
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
   *
   */
  public getResourceFields(
    tenantId: number,
    modelName: string
  ): { [key: string]: IModelMetaField } {
    const meta = this.getResourceMeta(tenantId, modelName);

    return meta.fields;
  }

  public filterSupportFeatures = (
    tenantId,
    fields: { [key: string]: IModelMetaField2 }
  ) => {
    const isMultiFeaturesEnabled =
      this.branchesSettings.isMultiBranchesActive(tenantId);
    const isMultiWarehousesEnabled =
      this.warehousesSettings.isMultiWarehousesActive(tenantId);

    return pickBy(fields, (field) => {
      if (
        !isMultiWarehousesEnabled &&
        field.features?.includes(Features.WAREHOUSES)
      ) {
        return false;
      }
      if (
        !isMultiFeaturesEnabled &&
        field.features?.includes(Features.BRANCHES)
      ) {
        return false;
      }
      return true;
    });
  };

  public getResourceFields2(
    tenantId: number,
    modelName: string
  ): { [key: string]: IModelMetaField2 } {
    const meta = this.getResourceMeta(tenantId, modelName);

    return this.filterSupportFeatures(tenantId, meta.fields2);
  }

  public getResourceColumns(tenantId: number, modelName: string) {
    const meta = this.getResourceMeta(tenantId, modelName);

    return this.filterSupportFeatures(tenantId, meta.columns);
  }

  /**
   *
   * @param {number} tenantId
   * @param {string} modelName
   * @returns
   */
  public getResourceImportableFields(
    tenantId: number,
    modelName: string
  ): { [key: string]: IModelMetaField } {
    const fields = this.getResourceFields(tenantId, modelName);

    return pickBy(fields, (field) => field.importable);
  }

  /**
   * Retrieve the resource meta localized based on the current user language.
   */
  public getResourceMetaLocalized(meta, tenantId) {
    const $enumerationType = (field) =>
      field.fieldType === 'enumeration' ? field : undefined;

    const $hasFields = (field) =>
      'undefined' !== typeof field.fields ? field : undefined;

    const $ColumnHasColumns = (column) =>
      'undefined' !== typeof column.columns ? column : undefined;

    const $hasColumns = (columns) =>
      'undefined' !== typeof columns ? columns : undefined;

    const naviagations = [
      ['fields', qim.$each, 'name'],
      ['fields', qim.$each, $enumerationType, 'options', qim.$each, 'label'],
      ['fields2', qim.$each, 'name'],
      ['fields2', qim.$each, $enumerationType, 'options', qim.$each, 'label'],
      ['fields2', qim.$each, $hasFields, 'fields', qim.$each, 'name'],
      ['columns', $hasColumns, qim.$each, 'name'],
      [
        'columns',
        $hasColumns,
        qim.$each,
        $ColumnHasColumns,
        'columns',
        qim.$each,
        'name',
      ],
    ];
    return this.i18nService.i18nApply(naviagations, meta, tenantId);
  }
}
