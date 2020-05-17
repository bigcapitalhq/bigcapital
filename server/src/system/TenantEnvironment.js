

export default class TenantEnviroment {

  static get currentTenant() {
    return this.currentTenantWebsite;
  }

  static set currentTenant(website) {
    this.currentTenantWebsite = website;
  }
}