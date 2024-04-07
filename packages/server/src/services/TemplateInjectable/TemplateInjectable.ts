import { Tenant } from '@/system/models';
import { templateRender } from '@/utils';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class TemplateInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Renders the given filename of the template.
   * @param {number} tenantId
   * @param {string} filename
   * @returns {string}
   */
  public async render(tenantId: number, filename: string, options: Record<string, string | number | boolean>) {
    const i18n = this.tenancy.i18n(tenantId);

    const organization = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

    return templateRender(filename, {
      organizationName: organization.metadata.name,
      organizationEmail: organization.metadata.email,
      __: i18n.__,
      ...options,
    });
  }
}
