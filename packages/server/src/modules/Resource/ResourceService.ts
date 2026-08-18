import { ModuleRef } from '@nestjs/core';
import { pickBy, mapValues } from 'lodash';
import { I18nService } from 'nestjs-i18n';
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
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Retrieve resource model object.
   * @param {string} inputModelName - Input model name.
   */
  public getResourceModel(inputModelName: string) {
    const modelName = resourceToModelName(inputModelName);
    const resourceModel = this.moduleRef.get(modelName, { strict: false });

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
    const resourceMeta = resourceModel().getMeta(metakey);

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
  public filterSupportFeatures = async (
    fields: Record<string, IModelMetaField2 | IModelMetaColumn>,
  ) => {
    const isMultiFeaturesEnabled =
      await this.branchesSettings.isMultiBranchesActive();
    const isMultiWarehousesEnabled =
      await this.warehousesSettings.isMultiWarehousesActive();

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
   * Localizes a single field by translating its name, importHint and the
   * enumeration options labels.
   * @param {IModelMetaField2} field - The field to localize.
   * @returns {IModelMetaField2} - The localized field.
   */
  private localizeField(field: IModelMetaField2): IModelMetaField2 {
    return {
      ...field,
      name: this.i18nService.t(field.name, { defaultValue: field.name }),
      ...(field.importHint
        ? {
            importHint: this.i18nService.t(field.importHint, {
              defaultValue: field.importHint,
            }),
          }
        : {}),
      // Localize the enumeration options labels.
      ...(field.fieldType === 'enumeration' && field.options
        ? {
            options: field.options.map((option) => ({
              ...option,
              label: this.i18nService.t(option.label, {
                defaultValue: option.label,
              }),
            })),
          }
        : {}),
      // Recursively localize nested fields (for collection types)
      ...(field.fields
        ? {
            fields: this.localizeFields(
              field.fields as unknown as Record<string, IModelMetaField2>,
            ) as unknown as typeof field.fields,
          }
        : {}),
    } as IModelMetaField2;
  }

  /**
   * Localizes all fields in a fields map.
   * @param {Record<string, IModelMetaField2>} fields - The fields to localize.
   * @returns {Record<string, IModelMetaField2>} - The localized fields.
   */
  private localizeFields(
    fields: Record<string, IModelMetaField2>,
  ): Record<string, IModelMetaField2> {
    return mapValues(fields, (field) => this.localizeField(field));
  }

  /**
   * Localizes a single column by translating its name.
   * @param {IModelMetaColumn} column - The column to localize.
   * @returns {IModelMetaColumn} - The localized column.
   */
  private localizeColumn(column: IModelMetaColumn): IModelMetaColumn {
    return {
      ...column,
      name: this.i18nService.t(column.name, { defaultValue: column.name }),
      // Recursively localize nested columns (for collection types)
      ...('columns' in column
        ? {
            columns: mapValues(
              column.columns as Record<string, IModelMetaColumn>,
              (nestedColumn) => this.localizeColumn(nestedColumn),
            ),
          }
        : {}),
    } as IModelMetaColumn;
  }

  /**
   * Localizes the columns of the given columns map.
   * @param {Record<string, IModelMetaColumn>} columns - The columns to localize.
   * @returns {Record<string, IModelMetaColumn>} - The localized columns.
   */
  private localizeColumns(
    columns: Record<string, IModelMetaColumn>,
  ): Record<string, IModelMetaColumn> {
    return mapValues(columns, (column) => this.localizeColumn(column));
  }

  /**
   * Localizes the resource meta fields, fields2 and columns names and the
   * enumeration options labels based on the current request language.
   * @param {IModelMeta} meta - The resource meta to localize.
   * @returns {IModelMeta} - The localized resource meta.
   */
  public localizeResourceMeta(meta: IModelMeta): IModelMeta {
    return {
      ...meta,
      fields: this.localizeFields(
        meta.fields as unknown as Record<string, IModelMetaField2>,
      ) as Record<string, IModelMetaField>,
      fields2: this.localizeFields(meta.fields2),
      columns: this.localizeColumns(meta.columns),
    };
  }

  /**
   * Retrieve the resource fields with localized names and hints.
   * @param {string} modelName
   * @returns {IModelMetaField2}
   */
  public async getResourceFields2(modelName: string): Promise<{
    [key: string]: IModelMetaField2;
  }> {
    const meta = this.getResourceMeta(modelName);
    const filteredFields = await this.filterSupportFeatures(meta.fields2);

    return this.localizeFields(
      filteredFields as Record<string, IModelMetaField2>,
    );
  }

  /**
   * Retrieve the resource columns.
   * @param {string} modelName - The model name.
   * @returns {IModelMetaColumn}
   */
  public async getResourceColumns(modelName: string) {
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
}
