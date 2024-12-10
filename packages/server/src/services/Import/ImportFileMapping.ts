import { fromPairs, isUndefined } from 'lodash';
import { Inject, Service } from 'typedi';
import {
  ImportDateFormats,
  ImportFileMapPOJO,
  ImportMappingAttr,
} from './interfaces';
import ResourceService from '../Resource/ResourceService';
import { ServiceError } from '@/exceptions';
import { ERRORS,readImportFile } from './_utils';
import { Import } from '@/system/models';
import { parseSheetData } from './sheet_utils';

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
    importId: string,
    maps: ImportMappingAttr[]
  ): Promise<ImportFileMapPOJO> {
    const importFile = await Import.query()
      .findOne('filename', importId)
      .throwIfNotFound();

    // Invalidate the from/to map attributes.
    this.validateMapsAttrs(tenantId, importFile, maps);

    // @todo validate the required fields.

    // Validate the diplicated relations of map attrs.
    this.validateDuplicatedMapAttrs(maps);

    // Validate the date format mapping.
    this.validateDateFormatMapping(tenantId, importFile.resource, maps);
    await this.validateDataForTax(tenantId, importFile);

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
    let isInclusiveThere = 0;


    // is not empty, is not undefined or map.group
    maps.forEach((map) => {
      let _invalid = true;


      if(map.to === 'taxRateId' || map.to === 'isInclusiveTax'){
        isInclusiveThere = isInclusiveThere+1;
      }
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
    else if(isInclusiveThere == 1) {
      throw new ServiceError(ERRORS.AMOUNT_ARE_AND_TAX_RATE_ARE_REQUIRED_IF_ANY_ONE_OF_THEM_SELECTED);
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
  private async validateDataForTax(tenantId: number,
    importFile: any,
    )
  {
    const buffer = await readImportFile(importFile.filename);
    const [sheetData, sheetColumns] = parseSheetData(buffer);
    if(importFile.resource === "SaleInvoice")
    {
      let invoiceNo = "";
      let isInvoiceTaxInclusive;
      const Count = sheetData.length;
      for (let i = 0; i < Count; i++) {
        if (sheetData[i]['Amounts Are'])
          {
          invoiceNo = sheetData[i]['Invoice No.'];
          isInvoiceTaxInclusive = sheetData[i]['Amounts Are'];
          for (let j = i + 1; j < Count; j++) {
            if (invoiceNo === sheetData[j]['Invoice No.'] && isInvoiceTaxInclusive !== sheetData[j]['Amounts Are']) {
              throw new ServiceError(ERRORS.AN_INVOICE_CAN_HAVE_ONE_AMOUNT_IN_EITHER_TRUE_OR_FALSE);
            }
          }
        }
      }
  }
  }
}
