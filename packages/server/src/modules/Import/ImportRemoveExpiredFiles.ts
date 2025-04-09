import * as moment from 'moment';
import bluebird from 'bluebird';
import { deleteImportFile } from './_utils';
import { Inject, Injectable } from '@nestjs/common';
import { ImportModel } from './models/Import';

@Injectable()
export class ImportDeleteExpiredFiles {
  constructor(
    @Inject(ImportModel.name)
    private readonly importModel: typeof ImportModel,
  ) {}
  /**
   * Delete expired files.
   */
  async deleteExpiredFiles() {
    const yesterday = moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm');

    const expiredImports = await this.importModel
      .query()
      .where('createdAt', '<', yesterday);
    await bluebird.map(
      expiredImports,
      async (expiredImport) => {
        await deleteImportFile(expiredImport.filename);
      },
      { concurrency: 10 },
    );
    const expiredImportsIds = expiredImports.map(
      (expiredImport) => expiredImport.id,
    );
    if (expiredImportsIds.length > 0) {
      await this.importModel.query().whereIn('id', expiredImportsIds).delete();
    }
  }
}
