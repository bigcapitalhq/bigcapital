import { fromPairs, isUndefined } from 'lodash';
import { Inject, Service } from 'typedi';
import {
  ImportDateFormats,
  ImportFileMapPOJO,
  ImportMappingAttr,
} from './interfaces';
import ResourceService from '../Resource/ResourceService';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './_utils';
import { Import } from '@/system/models';

@Service()
export class ImportFileMapping {
  @Inject()
  private resource: ResourceService;

  /**
   * Mapping the excel sheet columns with resource columns.
   * @param {number} tenantId
   * @param {number} importId
   * @param {ImportMappingAttr} maps
   */
  public async mapping(
    tenantId: number,
    importId: number,
    maps: ImportMappingAttr[]
  ): Promise<ImportFileMapPOJO> {
    const importFile = await Import.query()
      .findOne('filename', importId)
      .throwIfNotFound();

    // Invalidate the from/to map attributes.
    this.validateMapsAttrs(tenantId, importFile, maps);

    // Validate the diplicated relations of map attrs.
    this.validateDuplicatedMapAttrs(maps);

    // Validate the date format mapping.
    this.validateDateFormatMapping(tenantId, importFile.resource, maps);

    const mappingStringified = JSON.stringify(maps);

    await Import.query().findById(importFile.id).patch({
      mapping: mappingStringified,
    });
    return {
      import: {
        importId: importFile.importId,
        resource: importFile.resource,
      },
    };
  }

  /**
   * Validate the mapping attributes.
   * @param {number} tenantId -
   * @param {} importFile -
   * @param {ImportMappingAttr[]} maps
   * @throws {ServiceError(ERRORS.INVALID_MAP_ATTRS)}
   */
  private validateMapsAttrs(
    tenantId: number,
    importFile: any,
    maps: ImportMappingAttr[]
  ) {
    const fields = this.resource.getResourceFields2(
      tenantId,
      importFile.resource
    );
    const columnsMap = fromPairs(
      importFile.columnsParsed.map((field) => [field, ''])
    );
    const invalid = [];

    // is not empty, is not undefined or map.group
    maps.forEach((map) => {
      let _invalid = true;

      if (!map.group && fields[map.to]) {
        _invalid = false;
      }
      if (map.group && fields[map.group] && fields[map.group]?.fields[map.to]) {
        _invalid = false;
      }
      if (columnsMap[map.from]) {
        _invalid = false;
      }
      if (_invalid) {
        invalid.push(map);
      }
    });
    if (invalid.length > 0) {
      throw new ServiceError(ERRORS.INVALID_MAP_ATTRS);
    }
  }

  /**
   * Validate the map attrs relation should be one-to-one relation only.
   * @param {ImportMappingAttr[]} maps
   */
  private validateDuplicatedMapAttrs(maps: ImportMappingAttr[]) {
    const fromMap = {};
    const toMap = {};

    maps.forEach((map) => {
      if (fromMap[map.from]) {
        throw new ServiceError(ERRORS.DUPLICATED_FROM_MAP_ATTR);
      } else {
        fromMap[map.from] = true;
      }
      const toPath = !isUndefined(map?.group)
        ? `${map.group}.${map.to}`
        : map.to;

      if (toMap[toPath]) {
        throw new ServiceError(ERRORS.DUPLICATED_TO_MAP_ATTR);
      } else {
        toMap[toPath] = true;
      }
    });
  }

  /**
   * Validates the date format mapping.
   * @param {number} tenantId
   * @param {string} resource
   * @param {ImportMappingAttr[]} maps
   */
  private validateDateFormatMapping(
    tenantId: number,
    resource: string,
    maps: ImportMappingAttr[]
  ) {
    const fields = this.resource.getResourceImportableFields(
      tenantId,
      resource
    );
    // @todo Validate date type of the nested fields.
    maps.forEach((map) => {
      if (
        typeof fields[map.to] !== 'undefined' &&
        fields[map.to].fieldType === 'date'
      ) {
        if (
          typeof map.dateFormat !== 'undefined' &&
          ImportDateFormats.indexOf(map.dateFormat) === -1
        ) {
          throw new ServiceError(ERRORS.INVALID_MAP_DATE_FORMAT);
        }
      }
    });
  }
}
