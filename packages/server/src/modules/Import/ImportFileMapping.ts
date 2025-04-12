import { Inject, Injectable } from '@nestjs/common';
import { fromPairs, isUndefined } from 'lodash';
import {
  ImportDateFormats,
  ImportFileMapPOJO,
  ImportMappingAttr,
} from './interfaces';
import { ResourceService } from '../Resource/ResourceService';
import { ServiceError } from '../Items/ServiceError';
import { ERRORS } from './_utils';
import { ImportModel } from './models/Import';

@Injectable()
export class ImportFileMapping {
  constructor(
    private readonly resource: ResourceService,

    @Inject(ImportModel.name)
    private readonly importModel: typeof ImportModel,
  ) {}

  /**
   * Mapping the excel sheet columns with resource columns.
   * @param {number} importId
   * @param {ImportMappingAttr} maps
   */
  public async mapping(
    importId: string,
    maps: ImportMappingAttr[],
  ): Promise<ImportFileMapPOJO> {
    const importFile = await this.importModel
      .query()
      .findOne('filename', importId)
      .throwIfNotFound();

    // Invalidate the from/to map attributes.
    this.validateMapsAttrs(importFile, maps);

    // @todo validate the required fields.

    // Validate the diplicated relations of map attrs.
    this.validateDuplicatedMapAttrs(maps);

    // Validate the date format mapping.
    this.validateDateFormatMapping(importFile.resource, maps);

    const mappingStringified = JSON.stringify(maps);

    await this.importModel.query().findById(importFile.id).patch({
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
   * @param {} importFile -
   * @param {ImportMappingAttr[]} maps
   * @throws {ServiceError(ERRORS.INVALID_MAP_ATTRS)}
   */
  private validateMapsAttrs(importFile: any, maps: ImportMappingAttr[]) {
    const fields = this.resource.getResourceFields2(importFile.resource);
    const columnsMap = fromPairs(
      importFile.columnsParsed.map((field) => [field, '']),
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
   * @param {string} resource
   * @param {ImportMappingAttr[]} maps
   */
  private validateDateFormatMapping(
    resource: string,
    maps: ImportMappingAttr[],
  ) {
    const fields = this.resource.getResourceImportableFields(resource);
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
