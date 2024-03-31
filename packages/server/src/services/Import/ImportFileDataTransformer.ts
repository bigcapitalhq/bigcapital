import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import bluebird from 'bluebird';
import { isUndefined, get, chain, toArray, pickBy, castArray } from 'lodash';
import { ImportMappingAttr, ResourceMetaFieldsMap } from './interfaces';
import { parseBoolean } from '@/utils';
import { trimObject } from './_utils';
import { Account, Item } from '@/models';
import ResourceService from '../Resource/ResourceService';
import { Knex } from 'knex';

const CurrencyParsingDTOs = 10;

@Service()
export class ImportFileDataTransformer {
  @Inject()
  private resource: ResourceService;

  /**
   *
   * @param {number} tenantId -
   * @param {}
   */
  public async parseSheetData(
    tenantId: number,
    importFile: any,
    importableFields: any,
    data: Record<string, unknown>[],
    trx?: Knex.Transaction
  ) {
    // Sanitize the sheet data.
    const sanitizedData = this.sanitizeSheetData(data);

    // Map the sheet columns key with the given map.
    const mappedDTOs = this.mapSheetColumns(
      sanitizedData,
      importFile.mappingParsed
    );
    const resourceModel = this.resource.getResourceModel(
      tenantId,
      importFile.resource
    );
    // Parse the mapped sheet values.
    return this.parseExcelValues(
      importableFields,
      mappedDTOs,
      resourceModel,
      trx
    );
  }

  /**
   * Sanitizes the data in the imported sheet by trimming object keys.
   * @param json - The JSON data representing the imported sheet.
   * @returns {string[][]} - The sanitized data with trimmed object keys.
   */
  public sanitizeSheetData(json) {
    return R.compose(R.map(trimObject))(json);
  }

  /**
   * Maps the columns of the imported data based on the provided mapping attributes.
   * @param {Record<string, any>[]} body - The array of data objects to map.
   * @param {ImportMappingAttr[]} map - The mapping attributes.
   * @returns {Record<string, any>[]} - The mapped data objects.
   */
  public mapSheetColumns(
    body: Record<string, any>[],
    map: ImportMappingAttr[]
  ): Record<string, any>[] {
    return body.map((item) => {
      const newItem = {};
      map
        .filter((mapping) => !isUndefined(item[mapping.from]))
        .forEach((mapping) => {
          newItem[mapping.to] = item[mapping.from];
        });
      return newItem;
    });
  }

  /**
   * Parses sheet values before passing to the service layer.
   * @param {ResourceMetaFieldsMap} fields -
   * @param {Record<string, any>} valueDTOS -
   * @returns {Record<string, any>}
   */
  public async parseExcelValues(
    fields: ResourceMetaFieldsMap,
    valueDTOs: Record<string, any>[],
    resourceModel: any,
    trx?: Knex.Transaction
  ): Promise<Record<string, any>> {
    // Prases the given object value based on the field key type. 
    const parser = async (value, key) => {
      let _value = value;
      const field = fields[key];

      // Parses the boolean value.
      if (fields[key].fieldType === 'boolean') {
        _value = parseBoolean(value, false);

        // Parses the enumeration value.
      } else if (field.fieldType === 'enumeration') {
        const field = fields[key];
        const option = get(field, 'options', []).find(
          (option) => option.label === value
        );
        _value = get(option, 'key');
        // Parses the numeric value.
      } else if (fields[key].fieldType === 'number') {
        _value = parseFloat(value);
        // Parses the relation value.
      } else if (field.fieldType === 'relation') {
        const relationModel = resourceModel.relationMappings[field.relationKey];
        const RelationModel = relationModel?.modelClass;

        if (!relationModel || !RelationModel) {
          throw new Error(`The relation model of ${key} field is not exist.`);
        }
        const relationQuery = RelationModel.query(trx);
        const relationKeys = field?.importableRelationLabel
          ? castArray(field?.importableRelationLabel)
          : castArray(field?.relationEntityLabel);

        relationQuery.where(function () {
          relationKeys.forEach((relationKey: string) => {
            this.orWhereRaw('LOWER(??) = LOWER(?)', [relationKey, value]);
          });
        });
        const result = await relationQuery.first();
        _value = get(result, 'id');
      }
      return _value;
    };

    const parseKey = (key: string) => {
      const field = fields[key];
      let _objectTransferObjectKey = key;

      if (field.fieldType === 'relation') {
        _objectTransferObjectKey = `${key}Id`;
      }
      return _objectTransferObjectKey;
    };
    const parseAsync = async (valueDTO) => {
      // Remove the undefined fields.
      const _valueDTO = pickBy(
        valueDTO,
        (value, key) => !isUndefined(fields[key])
      );
      const keys = Object.keys(_valueDTO);

      // Map the object values.
      return bluebird.reduce(
        keys,
        async (acc, key) => {
          const parsedValue = await parser(_valueDTO[key], key);
          const parsedKey = await parseKey(key);
          acc[parsedKey] = parsedValue;
          return acc;
        },
        {}
      );
    };
    return bluebird.map(valueDTOs, parseAsync, {
      concurrency: CurrencyParsingDTOs,
    });
  }
}
