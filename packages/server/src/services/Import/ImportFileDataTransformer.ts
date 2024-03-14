import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { isUndefined, mapValues, get, pickBy, chain } from 'lodash';
import { ImportMappingAttr, ResourceMetaFieldsMap } from './interfaces';
import { parseBoolean } from '@/utils';
import { trimObject } from './_utils';
import ResourceService from '../Resource/ResourceService';

@Service()
export class ImportFileDataTransformer {
  /**
   *
   * @param {number} tenantId -
   * @param {}
   */
  public parseSheetData(
    importFile: any,
    importableFields: any,
    data: Record<string, unknown>[]
  ) {
    // Sanitize the sheet data.
    const sanitizedData = this.sanitizeSheetData(data);

    // Map the sheet columns key with the given map.
    const mappedDTOs = this.mapSheetColumns(
      sanitizedData,
      importFile.mappingParsed
    );
    // Parse the mapped sheet values.
    const parsedValues = this.parseExcelValues(importableFields, mappedDTOs);

    return parsedValues;
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
  public parseExcelValues(
    fields: ResourceMetaFieldsMap,
    valueDTOs: Record<string, any>[]
  ): Record<string, any> {
    const parser = (value, key) => {
      let _value = value;

      // Parses the boolean value.
      if (fields[key].fieldType === 'boolean') {
        _value = parseBoolean(value, false);

        // Parses the enumeration value.
      } else if (fields[key].fieldType === 'enumeration') {
        const field = fields[key];
        const option = get(field, 'options', []).find(
          (option) => option.label === value
        );
        _value = get(option, 'key');
        // Prases the numeric value.
      } else if (fields[key].fieldType === 'number') {
        _value = parseFloat(value);
      }
      return _value;
    };
    return valueDTOs.map((DTO) => {
      return chain(DTO)
        .pickBy((value, key) => !isUndefined(fields[key]))
        .mapValues(parser)
        .value();
    });
  }
}
