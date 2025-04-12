import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ImportDeleteExpiredFiles } from '../ImportRemoveExpiredFiles';

@Injectable()
export class ImportDeleteExpiredFilesJobs {
  constructor(
    private readonly importDeleteExpiredFiles: ImportDeleteExpiredFiles,
  ) {}

  /**
   * Triggers sending invoice mail.
   */
  @Cron('* * * * *')
  async importDeleteExpiredJob() {
    try {
      console.log('Delete expired import files has started.');
      await this.importDeleteExpiredFiles.deleteExpiredFiles();
    } catch (error) {
      console.log(error);
    }
  }
}
