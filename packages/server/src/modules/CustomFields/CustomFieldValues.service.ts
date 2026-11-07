import { Inject, Injectable } from '@nestjs/common';
import { camelCase } from 'lodash';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CustomField } from './models/CustomField.model';
import { CustomFieldValue } from './models/CustomFieldValue.model';
import { CustomFieldsValidator } from './CustomFieldsValidator.service';
import {
  CUSTOM_FIELD_ERRORS,
  CUSTOM_FIELD_SEARCHABLE_DATA_TYPES,
  CustomFieldDataType,
  CustomFieldResource,
} from './constants';
import { COMPARATOR_TYPE } from '@/modules/DynamicListing/DynamicFilter/constants';
import { sanitizeSortDirection } from '@/modules/DynamicListing/DynamicFilter/sanitizeSortDirection';

export interface ISaveCustomFieldValuesOptions {
  isCreate?: boolean;
  resourceId?: number;
}

@Injectable()
export class CustomFieldValuesService {
  constructor(
    private readonly validator: CustomFieldsValidator,

    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,

    @Inject(CustomFieldValue.name)
    private readonly customFieldValueModel: TenantModelProxy<
      typeof CustomFieldValue
    >,
  ) {}

  /**
   * Retrieves the custom field definitions of the given resource.
   * @param {string} resourceName
   * @param {object} options
   */
  public getDefinitions(
    resourceName: string,
    options: { activeOnly?: boolean; trx?: Knex.Transaction } = {},
  ) {
    const { activeOnly = true, trx } = options;
    const query = this.customFieldModel()
      .query(trx)
      .where('resource_name', resourceName)
      .orderBy('sort_order', 'asc')
      .orderBy('id', 'asc');

    if (activeOnly) {
      query.where('active', true);
    }
    return query;
  }

  /**
   * Normalizes and validates custom field values.
   *
   * Returns `null` when the payload is undefined in edit mode, indicating that
   * the caller should leave the stored values untouched.
   */
  public async normalizeAndValidate(
    resourceName: CustomFieldResource,
    values: Record<string, unknown> | undefined,
    options: ISaveCustomFieldValuesOptions & { trx?: Knex.Transaction } = {},
  ): Promise<Record<string, unknown> | null> {
    const { isCreate = false, resourceId, trx } = options;

    if (values === undefined) {
      if (!isCreate) {
        return null;
      }
      values = {};
    }
    const definitions = await this.getDefinitions(resourceName, {
      activeOnly: true,
      trx,
    });
    if (definitions.length === 0) {
      return {};
    }
    const normalizedInput = Object.entries(values).reduce(
      (acc, [key, value]) => {
        acc[camelCase(key)] = value;
        return acc;
      },
      {} as Record<string, unknown>,
    );
    const result: Record<string, unknown> = {};

    for (const definition of definitions) {
      const inputKey = camelCase(definition.fieldName);
      const hasValue = Object.prototype.hasOwnProperty.call(
        normalizedInput,
        inputKey,
      );

      let rawValue: unknown;

      if (hasValue) {
        rawValue = normalizedInput[inputKey];
      } else if (
        isCreate &&
        definition.defaultValue !== undefined &&
        definition.defaultValue !== null
      ) {
        rawValue = definition.defaultValue;
      } else if (definition.required) {
        throw new ServiceError(
          CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_REQUIRED,
          `The "${definition.label}" field is required.`,
          { fieldKey: definition.fieldName, label: definition.label },
        );
      } else {
        continue;
      }
      if (
        rawValue === null ||
        rawValue === undefined ||
        (typeof rawValue === 'string' && rawValue.trim() === '')
      ) {
        if (definition.required) {
          throw new ServiceError(
            CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_REQUIRED,
            `The "${definition.label}" field is required.`,
            { fieldKey: definition.fieldName, label: definition.label },
          );
        }
        result[definition.fieldName] = null;
        continue;
      }
      const normalizedValue = this.validator.normalizeValue(
        definition,
        rawValue,
      );

      if (definition.unique) {
        await this.validateUniqueValue(
          definition,
          normalizedValue,
          resourceId,
          trx,
        );
      }
      result[definition.fieldName] = normalizedValue;
    }
    return result;
  }

  /**
   * Saves custom field values for the given resource record.
   */
  public async saveValues(
    resourceName: CustomFieldResource,
    resourceId: number,
    values: Record<string, unknown> | undefined,
    trx?: Knex.Transaction,
    options: ISaveCustomFieldValuesOptions = {},
  ): Promise<void> {
    const normalized = await this.normalizeAndValidate(resourceName, values, {
      ...options,
      resourceId,
      trx,
    });

    if (normalized === null) {
      return;
    }
    const definitions = await this.getDefinitions(resourceName, {
      activeOnly: false,
      trx,
    });
    const definitionsMap = new Map(
      definitions.map((definition) => [definition.fieldName, definition]),
    );

    for (const [fieldName, value] of Object.entries(normalized)) {
      const definition = definitionsMap.get(fieldName);

      if (!definition) {
        continue;
      }
      const storageColumns = this.validator.toStorageColumns(definition, value);

      const existing = await this.customFieldValueModel()
        .query(trx)
        .where('custom_field_id', definition.id)
        .where('resource_name', resourceName)
        .where('resource_id', resourceId)
        .first();

      if (storageColumns === null) {
        if (existing) {
          await this.customFieldValueModel()
            .query(trx)
            .findById(existing.id)
            .delete();
        }
        continue;
      }
      if (existing) {
        await this.customFieldValueModel()
          .query(trx)
          .findById(existing.id)
          .patch(storageColumns);
      } else {
        await this.customFieldValueModel()
          .query(trx)
          .insert({
            customFieldId: definition.id,
            resourceName,
            resourceId,
            ...storageColumns,
          });
      }
    }
  }

  /**
   * Retrieves the custom field values of the given record.
   */
  public async getValues(
    resourceName: CustomFieldResource,
    resourceId: number,
    trx?: Knex.Transaction,
  ): Promise<Record<string, unknown>> {
    const definitions = await this.getDefinitions(resourceName, {
      activeOnly: true,
      trx,
    });
    const definitionsMap = new Map(
      definitions.map((definition) => [definition.id, definition]),
    );
    if (definitions.length === 0) {
      return {};
    }
    const rows = await this.customFieldValueModel()
      .query(trx)
      .where('resource_name', resourceName)
      .where('resource_id', resourceId)
      .whereIn(
        'custom_field_id',
        definitions.map((definition) => definition.id),
      );

    return rows.reduce(
      (acc, row) => {
        const definition = definitionsMap.get(row.customFieldId);

        if (!definition) {
          return acc;
        }
        acc[definition.fieldName] = this.validator.fromStorageRow({
          ...row,
          customField: definition,
        });
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  /**
   * Retrieves custom field values for multiple records in one query.
   */
  public async getValuesBulk(
    resourceName: CustomFieldResource,
    resourceIds: number[],
    trx?: Knex.Transaction,
  ): Promise<Record<number, Record<string, unknown>>> {
    const result = resourceIds.reduce(
      (acc, resourceId) => {
        acc[resourceId] = {};
        return acc;
      },
      {} as Record<number, Record<string, unknown>>,
    );
    if (resourceIds.length === 0) {
      return result;
    }
    const definitions = await this.getDefinitions(resourceName, {
      activeOnly: true,
      trx,
    });
    const definitionsMap = new Map(
      definitions.map((definition) => [definition.id, definition]),
    );
    if (definitions.length === 0) {
      return result;
    }
    const rows = await this.customFieldValueModel()
      .query(trx)
      .where('resource_name', resourceName)
      .whereIn('resource_id', resourceIds)
      .whereIn(
        'custom_field_id',
        definitions.map((definition) => definition.id),
      );

    for (const row of rows) {
      const definition = definitionsMap.get(row.customFieldId);

      if (!definition) {
        continue;
      }
      result[row.resourceId][definition.fieldName] =
        this.validator.fromStorageRow({
          ...row,
          customField: definition,
        });
    }
    return result;
  }

  /**
   * Deletes all custom field values of the given record.
   */
  public async deleteValues(
    resourceName: CustomFieldResource,
    resourceId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.customFieldValueModel()
      .query(trx)
      .where('resource_name', resourceName)
      .where('resource_id', resourceId)
      .delete();
  }

  /**
   * Counts the stored values of the given field.
   */
  public async countValues(customFieldId: number): Promise<number> {
    const result = await this.customFieldValueModel()
      .query()
      .where('custom_field_id', customFieldId)
      .count('id as count')
      .first();

    return Number((result as any)?.count ?? 0);
  }

  /**
   * Retrieves the active fields used in the dynamic listing filters/search.
   */
  public getDynamicListFields(resourceName: string) {
    return this.getDefinitions(resourceName, { activeOnly: true });
  }

  /**
   * Maps the data type to the dynamic listing field type.
   */
  public getFilterFieldType(dataType: CustomFieldDataType): string {
    return this.validator.getFilterFieldType(dataType);
  }

  /**
   * Builds the dynamic listing fields map for the given resource.
   *
   * Each field gets `filterCustomQuery` and `sortCustomQuery` callbacks that
   * query the custom field values table through correlated subqueries.
   */
  public async buildDynamicListFields(
    resourceName: string,
    tableName: string,
  ): Promise<Record<string, any>> {
    const definitions = await this.getDefinitions(resourceName, {
      activeOnly: true,
    });
    const rawTableName = tableName.toUpperCase();

    return definitions.reduce(
      (acc, definition) => {
        const fieldType = this.validator.getFilterFieldType(
          definition.dataType,
        );

        acc[definition.fieldName] = {
          name: definition.label,
          column: definition.fieldName,
          fieldType,
          required: definition.required,
          customFieldId: definition.id,
          dataType: definition.dataType,
          searchable: CUSTOM_FIELD_SEARCHABLE_DATA_TYPES.includes(
            definition.dataType,
          ),
          ...(fieldType === 'enumeration'
            ? {
                options: (definition.options ?? []).map((option) => ({
                  key: String(option),
                  label: String(option),
                })),
              }
            : {}),
          filterCustomQuery: (builder, role) => {
            const { sql, bindings } = this.buildFilterExpression(
              definition,
              rawTableName,
              role,
            );
            builder.whereRaw(sql, bindings);
          },
          sortCustomQuery: (builder, role) => {
            const order = sanitizeSortDirection(role.order);
            const column = this.validator
              .getStorageColumn(definition.dataType)
              .toUpperCase();
            const resource = resourceName.replace(/'/g, "''");

            builder.orderByRaw(
              `(SELECT CFV.${column} FROM CUSTOM_FIELD_VALUES CFV ` +
                `WHERE CFV.CUSTOM_FIELD_ID = ${definition.id} ` +
                `AND CFV.RESOURCE_NAME = '${resource}' ` +
                `AND CFV.RESOURCE_ID = ${rawTableName}.ID LIMIT 1) ${order}`,
            );
          },
        };
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  /**
   * Builds the SQL expression for a custom field filter role.
   */
  private buildFilterExpression(
    definition: CustomField,
    tableName: string,
    role: { comparator?: string; value: unknown },
  ): { sql: string; bindings: unknown[] } {
    const column = this.validator
      .getStorageColumn(definition.dataType)
      .toUpperCase();
    const comparator = role.comparator || 'equals';
    const emptyExpr = { sql: '1 = 1', bindings: [] };

    if (role.value === null || role.value === undefined || role.value === '') {
      return emptyExpr;
    }
    const basePrefix =
      `EXISTS (SELECT 1 FROM CUSTOM_FIELD_VALUES CFV ` +
      `WHERE CFV.CUSTOM_FIELD_ID = ? ` +
      `AND CFV.RESOURCE_NAME = ? ` +
      `AND CFV.RESOURCE_ID = ${tableName}.ID AND `;

    // Multi-select values are stored as JSON arrays.
    if (definition.dataType === CustomFieldDataType.Multiselect) {
      if (comparator === 'not_contains' || comparator === 'not_contain') {
        return {
          sql: `${basePrefix}NOT JSON_CONTAINS(CFV.VALUE_JSON, ?))`,
          bindings: [
            definition.id,
            definition.resourceName,
            JSON.stringify(role.value),
          ],
        };
      }
      return {
        sql: `${basePrefix}JSON_CONTAINS(CFV.VALUE_JSON, ?))`,
        bindings: [
          definition.id,
          definition.resourceName,
          JSON.stringify(role.value),
        ],
      };
    }

    const isNumeric =
      definition.dataType === CustomFieldDataType.Number ||
      definition.dataType === CustomFieldDataType.Decimal;
    const isBoolean = definition.dataType === CustomFieldDataType.Checkbox;
    const isDate = definition.dataType === CustomFieldDataType.Date;

    let value: unknown = role.value;

    if (isNumeric) {
      value = Number(role.value);
    } else if (isBoolean) {
      value =
        role.value === true ||
        role.value === 'true' ||
        role.value === 1 ||
        role.value === '1'
          ? 1
          : 0;
    } else if (!isDate) {
      value = String(role.value);
    }

    const buildLike = (operator: 'LIKE' | 'NOT LIKE', pattern: string) => ({
      sql: `${basePrefix}CFV.${column} ${operator} ?)`,
      bindings: [definition.id, definition.resourceName, pattern],
    });
    const buildComparison = (operator: string) => ({
      sql: `${basePrefix}CFV.${column} ${operator} ?)`,
      bindings: [definition.id, definition.resourceName, value],
    });

    switch (comparator) {
      case COMPARATOR_TYPE.EQUAL:
      case COMPARATOR_TYPE.EQUALS:
      case COMPARATOR_TYPE.IS:
      default:
        return buildComparison('=');

      case COMPARATOR_TYPE.NOT_EQUAL:
      case COMPARATOR_TYPE.NOT_EQUALS:
      case COMPARATOR_TYPE.IS_NOT:
        return buildComparison('<>');

      case COMPARATOR_TYPE.CONTAINS:
      case COMPARATOR_TYPE.CONTAIN:
        return buildLike('LIKE', `%${value}%`);

      case COMPARATOR_TYPE.NOT_CONTAINS:
      case 'not_contain':
        return buildLike('NOT LIKE', `%${value}%`);

      case COMPARATOR_TYPE.STARTS_WITH:
      case COMPARATOR_TYPE.START_WITH:
        return buildLike('LIKE', `${value}%`);

      case COMPARATOR_TYPE.ENDS_WITH:
      case COMPARATOR_TYPE.END_WITH:
        return buildLike('LIKE', `%${value}`);

      case COMPARATOR_TYPE.BIGGER_THAN:
      case COMPARATOR_TYPE.BIGGER:
        return buildComparison('>');

      case COMPARATOR_TYPE.BIGGER_OR_EQUALS:
        return buildComparison('>=');

      case COMPARATOR_TYPE.SMALLER_THAN:
      case COMPARATOR_TYPE.SMALLER:
        return buildComparison('<');

      case COMPARATOR_TYPE.SMALLER_OR_EQUALS:
        return buildComparison('<=');

      case COMPARATOR_TYPE.AFTER:
        return buildComparison('>');

      case COMPARATOR_TYPE.BEFORE:
        return buildComparison('<');

      case COMPARATOR_TYPE.IN: {
        const values = Array.isArray(role.value) ? role.value : [role.value];
        const placeholders = values.map(() => '?').join(', ');

        return {
          sql: `${basePrefix}CFV.${column} IN (${placeholders}))`,
          bindings: [definition.id, definition.resourceName, ...values],
        };
      }
    }
  }

  /**
   * Returns the search roles for active searchable custom fields.
   */
  public getSearchRoles(customFields: Record<string, any>) {
    return Object.entries(customFields)
      .filter(([, field]) => field.searchable)
      .map(([fieldKey, field]) => ({
        fieldKey,
        comparator: field.fieldType === 'enumeration' ? 'equals' : 'contains',
        condition: 'or',
      }));
  }

  /**
   * Validates the value uniqueness against the stored values.
   */
  private async validateUniqueValue(
    definition: CustomField,
    value: unknown,
    resourceId?: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    if (
      definition.dataType === CustomFieldDataType.Multiselect ||
      value === null ||
      value === undefined
    ) {
      return;
    }
    const column = this.validator.getStorageColumn(definition.dataType);
    const query = this.customFieldValueModel()
      .query(trx)
      .where('custom_field_id', definition.id)
      .where('resource_name', definition.resourceName);

    if (resourceId != null) {
      query.whereNot('resource_id', resourceId);
    }
    if (definition.dataType === CustomFieldDataType.Date) {
      query.whereRaw(`DATE(${column.toUpperCase()}) = ?`, [value]);
    } else {
      query.where(column, value as any);
    }
    const existing = await query.first();

    if (existing) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_UNIQUE_VALUE,
        `The "${definition.label}" field must be unique.`,
        { fieldKey: definition.fieldName, label: definition.label },
      );
    }
  }
}
