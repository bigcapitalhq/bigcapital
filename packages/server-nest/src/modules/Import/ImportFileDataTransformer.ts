import { Inject, Service } from 'typedi';
import bluebird from 'bluebird';
import { isUndefined, pickBy, set } from 'lodash';
import { Knex } from 'knex';
import { ImportMappingAttr, ResourceMetaFieldsMap } from './interfaces';
import {
  valueParser,
  parseKey,
  getFieldKey,
  aggregate,
  sanitizeSheetData,
  getMapToPath,
} from './_utils';
import ResourceService from '../Resource/ResourceService';
import HasTenancyService from '../Tenancy/TenancyService';
import { CurrencyParsingDTOs } from './_constants';

@Service()
export class ImportFileDataTransformer {
  @Inject()
  private resource: ResourceService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Parses the given sheet data before passing to the service layer.
   * based on the mapped fields and the each field type.
   * @param {number} tenantId -
   * @param {}
   */
  public async parseSheetData(
    tenantId: number,
    importFile: any,
    importableFields: ResourceMetaFieldsMap,
    data: Record<string, unknown>[],
    trx?: Knex.Transaction
  ): Promise<Record<string, any>[]> {
    // Sanitize the sheet data.
    const sanitizedData = sanitizeSheetData(data);

    // Map the sheet columns key with the given map.
    const mappedDTOs = this.mapSheetColumns(
      sanitizedData,
      importFile.mappingParsed
    );
    // Parse the mapped sheet values.
    const parsedValues = await this.parseExcelValues(
      tenantId,
      importableFields,
      mappedDTOs,
      trx
    );
    const aggregateValues = this.aggregateParsedValues(
      tenantId,
      importFile.resource,
      parsedValues
    );
    return aggregateValues;
  }

  /**
   * Aggregates parsed data based on resource metadata configuration.
   * @param {number} tenantId
   * @param {string} resourceName
   * @param {Record<string, any>} parsedData
   * @returns {Record<string, any>[]}
   */
  public aggregateParsedValues = (
    tenantId: number,
    resourceName: string,
    parsedData: Record<string, any>[]
  ): Record<string, any>[] => {
    let _value = parsedData;
    const meta = this.resource.getResourceMeta(tenantId, resourceName);

    if (meta.importAggregator === 'group') {
      _value = aggregate(
        _value,
        meta.importAggregateBy,
        meta.importAggregateOn
      );
    }
    return _value;
  };

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
          const toPath = getMapToPath(mapping.to, mapping.group);
          newItem[toPath] = item[mapping.from];
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
    tenantId: number,
    fields: ResourceMetaFieldsMap,
    valueDTOs: Record<string, any>[],
    trx?: Knex.Transaction
  ): Promise<Record<string, any>[]> {
    const tenantModels = this.tenancy.models(tenantId);
    const _valueParser = valueParser(fields, tenantModels, trx);
    const _keyParser = parseKey(fields);

    const parseAsync = async (valueDTO) => {
      // Clean up the undefined keys that not exist in resource fields.
      const _valueDTO = pickBy(
        valueDTO,
        (value, key) => !isUndefined(fields[getFieldKey(key)])
      );
      // Keys of mapped values. key structure: `group.key` or `key`.
      const keys = Object.keys(_valueDTO);

      // Map the object values.
      return bluebird.reduce(
        keys,
        async (acc, key) => {
          const parsedValue = await _valueParser(_valueDTO[key], key);
          const parsedKey = await _keyParser(key);

          set(acc, parsedKey, parsedValue);
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
