import { Inject } from 'typedi';
import { promises as fs } from 'fs';
import path from 'path';
import events from '@/subscribers/events';
import { PromisePool } from '@supercharge/promise-pool';
import { IOrganizationBuildEventPayload } from '@/interfaces';
import { SeedDemoAccountItems } from '../DemoSeeders/SeedDemoItems';
import { ImportResourceApplication } from '@/services/Import/ImportResourceApplication';
import { getImportsStoragePath } from '@/services/Import/_utils';
import { OneClickDemo } from '@/system/models/OneclickDemo';

export class SeedInitialDemoAccountDataOnOrgBuild {
  @Inject()
  private importApp: ImportResourceApplication;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.organization.build,
      this.seedInitialDemoAccountDataOnOrgBuild.bind(this)
    );
  };

  /**
   * Demo account seeder.
   */
  get seedDemoAccountSeeders() {
    return [SeedDemoAccountItems];
  }

  /**
   * Initialize the seeder sheet file to the import storage first.
   * @param {string} fileName -
   * @returns {Promise<void>}
   */
  async initiateSeederFile(fileName: string) {
    const destination = path.join(getImportsStoragePath(), fileName);
    const source = path.join(global.__views_dir, `/demo-sheets`, fileName);

    // Use the fs.promises.copyFile method to copy the file
    await fs.copyFile(source, destination);
  }

  /**
   * Seeds initial demo account data on organization build
   * @param {IOrganizationBuildEventPayload}
   */
  async seedInitialDemoAccountDataOnOrgBuild({
    tenantId,
  }: IOrganizationBuildEventPayload) {
    const foundDemo = await OneClickDemo.query().findOne('tenantId', tenantId);

    // Can't continue if the found demo is not exists.
    // Means that account is not demo account.
    if (!foundDemo) {
      return null;
    }
    const results = await PromisePool.for(this.seedDemoAccountSeeders)
      .withConcurrency(1)
      .process(async (SeedDemoAccountSeeder) => {
        const seederInstance = new SeedDemoAccountSeeder();

        // Initialize the seeder sheet file before importing.
        await this.initiateSeederFile(seederInstance.importFileName);

        // Import the given seeder file.
        const importedFile = await this.importApp.import(
          tenantId,
          seederInstance.resource,
          seederInstance.importFileName,
          {}
        );
        // Mapping the columns with resource fields.
        await this.importApp.mapping(
          tenantId,
          importedFile.import.importId,
          seederInstance.mapping
        );
        // Commit the imported file.
        await this.importApp.process(tenantId, importedFile.import.importId);
      });

    if (results.errors) {
      throw results.errors;
    }
  }
}
