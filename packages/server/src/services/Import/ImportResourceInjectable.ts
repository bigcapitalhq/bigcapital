import XLSX, { readFile } from 'xlsx';
import * as R from 'ramda';
import async from 'async';
import { camelCase, snakeCase, upperFirst } from 'lodash';
import HasTenancyService from '../Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { first } from 'lodash';
import { ServiceError } from '@/exceptions';
import { validate } from 'class-validator';
import { AccountDTOSchema } from '../Accounts/CreateAccountDTOSchema';
import { AccountsApplication } from '../Accounts/AccountsApplication';
import { plainToClass, plainToInstance } from 'class-transformer';
const fs = require('fs').promises;

const ERRORS = {
  IMPORT_ID_NOT_FOUND: 'IMPORT_ID_NOT_FOUND',
};


@Service()
export class ImportResourceInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private accountsApplication: AccountsApplication;

  public async mapping(
    tenantId: number,
    importId: number,
    maps: { from: string; to: string }[]
  ) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query().find('filename', importId);

    if (!importFile) {
      throw new ServiceError(ERRORS.IMPORT_ID_NOT_FOUND);
    }
    //
    await Import.query()
      .findById(importFile.id)
      .update({
        maps: JSON.stringify(maps),
      });
    // - Validate the to columns.
    // - Store the mapping in the import table.
    // -
  }

  public async preview(tenantId: number, importId: string) {}

  /**
   *
   * @param tenantId
   * @param importId
   */
  public async importFile(tenantId: number, importId: string) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query().where('importId', importId).first();

    if (!importFile) {
      throw new ServiceError(ERRORS.IMPORT_ID_NOT_FOUND);
    }
    const buffer = await fs.readFile(`public/imports/${importFile.filename}`);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const data = R.compose(R.map(Object.keys), R.map(trimObject))(jsonData);

    const header = first(data);
    const body = jsonData;

    const mapping = JSON.parse(importFile.mapping) || [];
    const newData = [];

    const findToAttr = (from: string) => {
      const found = mapping.find((item) => {
        return item.from === from;
      });
      return found?.to;
    };

    body.forEach((row) => {
      const obj = {};

      header.forEach((key, index) => {
        const toIndex = camelCase(findToAttr(key));
        obj[toIndex] = row[key];
      });
      newData.push(obj);
    });

    const saveJob = async (data) => {
      const account = {};

      Object.keys(data).map((key) => {
        account[key] = data[key];
      });
      const accountClass = plainToInstance(AccountDTOSchema, account);
      const errors = await validate(accountClass);

      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors);
      } else {
        return this.accountsApplication.createAccount(tenantId, account);
      }
    };
    const saveDataQueue = async.queue(saveJob, 10);

    newData.forEach((data) => {
      saveDataQueue.push(data);
    });
    await saveDataQueue.drain();
  }
}
