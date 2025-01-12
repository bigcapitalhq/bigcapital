import { ModuleRef } from '@nestjs/core';
import { pickBy } from 'lodash';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { Injectable } from '@nestjs/common';
import { BranchesSettingsService } from '../Branches/BranchesSettings';
import { ServiceError } from '../Items/ServiceError';
import { IModelMetaColumn, IModelMetaField2 } from '@/interfaces/Model';
import { IModelMeta } from '@/interfaces/Model';
import { IModelMetaField } from '@/interfaces/Model';
import { Features } from '@/common/types/Features';
import { resourceToModelName } from './_utils';

const ERRORS = {
  RESOURCE_MODEL_NOT_FOUND: 'RESOURCE_MODEL_NOT_FOUND',
};

@Injectable()
export class ResourceService {
  constructor(
    private readonly branchesSettings: BranchesSettingsService,
    private readonly warehousesSettings: WarehousesSettings,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * Retrieve resource model object.
   * @param {string} inputModelName - Input model name.
   */
  public getResourceModel(inputModelName: string) {
    const modelName = resourceToModelName(inputModelName);
    const resourceModel = this.moduleRef.get(modelName);

    if (!resourceModel) {
      throw new ServiceError(ERRORS.RESOURCE_MODEL_NOT_FOUND);
    }
    return resourceModel;
  }

  /**
   * Retrieve the resource meta.
   * @param {string} modelName - Model name.
   * @param {string} metakey - Meta key.
   * @returns {IModelMeta}
   */
  public getResourceMeta(modelName: string, metakey?: string): IModelMeta {
    const resourceModel = this.getResourceModel(modelName);

    // Retrieve the resource meta.
    const resourceMeta = resourceModel.getMeta(metakey);

    // Localization the fields names.
    return resourceMeta;
  }

  /**
   * Retrieve the resource fields.
   * @param {string} modelName
   * @returns {IModelMetaField}
   */
  public getResourceFields(modelName: string): {
    [key: string]: IModelMetaField;
  } {
    const meta = this.getResourceMeta(modelName);

    return meta.fields;
  }

  /**
   * Filter the fields based on the features.
   * @param {IModelMetaField2} fields
   * @returns {IModelMetaField2}
   */
  public filterSupportFeatures = (
    fields: Record<string, IModelMetaField2 | IModelMetaColumn>,
  ) => {
    const isMultiFeaturesEnabled =
      this.branchesSettings.isMultiBranchesActive();
    const isMultiWarehousesEnabled =
      this.warehousesSettings.isMultiWarehousesActive();

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

  /**
   * Retrieve the resource fields.
   * @param {string} modelName
   * @returns {IModelMetaField2}
   */
  public getResourceFields2(modelName: string): {
    [key: string]: IModelMetaField2;
  } {
    const meta = this.getResourceMeta(modelName);

    return this.filterSupportFeatures(meta.fields2);
  }

  /**
   * Retrieve the resource columns.
   * @param {string} modelName - The model name.
   * @returns {IModelMetaColumn}
   */
  public getResourceColumns(modelName: string) {
    const meta = this.getResourceMeta(modelName);

    return this.filterSupportFeatures(meta.columns);
  }

  /**
   * Retrieve the resource importable fields.
   * @param {string} modelName - The model name.
   * @returns {IModelMetaField}
   */
  public getResourceImportableFields(modelName: string): {
    [key: string]: IModelMetaField;
  } {
    const fields = this.getResourceFields(modelName);

    return pickBy(fields, (field) => field.importable);
  }

  /**
   * Retrieve the resource meta localized based on the current user language.
   */
  // public getResourceMetaLocalized(meta, tenantId) {
  //   const $enumerationType = (field) =>
  //     field.fieldType === 'enumeration' ? field : undefined;

  //   const $hasFields = (field) =>
  //     'undefined' !== typeof field.fields ? field : undefined;

  //   const $ColumnHasColumns = (column) =>
  //     'undefined' !== typeof column.columns ? column : undefined;

  //   const $hasColumns = (columns) =>
  //     'undefined' !== typeof columns ? columns : undefined;

  //   const naviagations = [
  //     ['fields', qim.$each, 'name'],
  //     ['fields', qim.$each, $enumerationType, 'options', qim.$each, 'label'],
  //     ['fields2', qim.$each, 'name'],
  //     ['fields2', qim.$each, $enumerationType, 'options', qim.$each, 'label'],
  //     ['fields2', qim.$each, $hasFields, 'fields', qim.$each, 'name'],
  //     ['columns', $hasColumns, qim.$each, 'name'],
  //     [
  //       'columns',
  //       $hasColumns,
  //       qim.$each,
  //       $ColumnHasColumns,
  //       'columns',
  //       qim.$each,
  //       'name',
  //     ],
  //   ];
  //   return this.i18nService.i18nApply(naviagations, meta, tenantId);
  // }
}
