import { Seeder } from "./Seeder";

export class TenantSeeder extends Seeder{
  public knex: any;
  public i18n: i18nAPI;
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
