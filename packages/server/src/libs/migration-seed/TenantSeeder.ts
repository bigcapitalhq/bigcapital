// @ts-nocheck
import { I18nService } from 'nestjs-i18n';
import { Seeder } from './Seeder';

export class TenantSeeder extends Seeder {
  public knex: any;
  public i18n: I18nService;
  public models: any;
  public tenant: any;

  constructor(knex) {
    super(knex);
    this.knex = knex;
  }

  setI18n(i18n) {
    this.i18n = i18n;
  }

  setModels(models) {
    this.models = models;
  }

  setTenant(tenant) {
    this.tenant = tenant;
  }
}
