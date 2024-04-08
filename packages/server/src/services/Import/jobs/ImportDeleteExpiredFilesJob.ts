import Container, { Service } from 'typedi';
import { ImportDeleteExpiredFiles } from '../ImportRemoveExpiredFiles';

@Service()
export class ImportDeleteExpiredFilesJobs {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define('delete-expired-imported-files', this.handler);
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const importDeleteExpiredFiles = Container.get(ImportDeleteExpiredFiles);

    try {
      console.log('Delete expired import files has started.');
      await importDeleteExpiredFiles.deleteExpiredFiles();
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
