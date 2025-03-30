import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import * as uniqid from 'uniqid';
import { TenantRepository as TenantBaseRepository } from '@/common/repository/TenantRepository';
import { SystemKnexConnection } from '../SystemDB/SystemDB.constants';
import { TenantModel } from '../models/TenantModel';
import { ConfigService } from '@nestjs/config';
import { TenantMetadata } from '../models/TenantMetadataModel';

@Injectable()
export class TenantRepository extends TenantBaseRepository {
  constructor(
    private readonly configService: ConfigService,

    @Inject(SystemKnexConnection)
    private readonly tenantDBKnex: Knex,

    @Inject(TenantMetadata.name)
    private readonly tenantMetadataModel: typeof TenantMetadata,
  ) {
    super();
  }

  /**
   * Gets the repository's model.
   */
  get model(): typeof TenantModel {
    return TenantModel.bindKnex(this.tenantDBKnex);
  }

  /**
   * Creates a new tenant with random organization id.
   */
  createWithUniqueOrgId(uniqId?: string) {
    const organizationId = uniqid() || uniqId;
    return this.model.query().insert({ organizationId });
  }

  /**
   * Mark as seeded.
   * @param {number} tenantId
   */
  markAsSeeded() {
    const seededAt = moment().toMySqlDateTime();
    return this.model.query().update({ seededAt });
  }

  /**
   * Mark the the given organization as initialized.
   * @param {string} organizationId
   */
  markAsInitialized() {
    const initializedAt = moment().toMySqlDateTime();
    return this.model.query().update({ initializedAt });
  }

  /**
   * Marks the given tenant as built.
   */
  markAsBuilt() {
    const builtAt = moment().toMySqlDateTime();
    return this.model.query().update({ builtAt });
  }

  /**
   * Marks the given tenant as built.
   * @param {string} buildJobId - The build job id.
   */
  markAsBuilding(buildJobId: string) {
    return this.model.query().update({ buildJobId });
  }

  /**
   * Marks the given tenant as built.
   */
  markAsBuildCompleted() {
    return this.model.query().update({ buildJobId: null });
  }

  /**
   * Marks the given tenant as upgrading.
   * @param {number} tenantId
   * @param {string} upgradeJobId
   * @returns
   */
  markAsUpgrading(tenantId, upgradeJobId) {
    return this.model.query().update({ upgradeJobId }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as upgraded.
   * @param {number} tenantId
   * @returns
   */
  markAsUpgraded(tenantId) {
    return this.model
      .query()
      .update({ upgradeJobId: null })
      .where({ id: tenantId });
  }

  /**
   * Saves the metadata of the given tenant.
   * @param {number} tenantId - The tenant id.
   * @param {Record<string, any>} metadata - The metadata to save.
   */
  async saveMetadata(tenantId: number, metadata: Record<string, any>) {
    const foundMetadata = await this.tenantMetadataModel
      .query()
      .findOne({ tenantId });
    const updateOrInsert = foundMetadata ? 'patch' : 'insert';

    return this.tenantMetadataModel
      .query()
      [updateOrInsert]({
        tenantId,
        ...metadata,
      })
      .where({ tenantId });
  }

  /**
   * Adds organization database latest batch number.
   * @param {number} tenantId
   * @param {number} version
   */
  flagTenantDBBatch() {
    return this.model.query().update({
      databaseBatch: this.configService.get('databaseBatch'),
    });
  }
}
