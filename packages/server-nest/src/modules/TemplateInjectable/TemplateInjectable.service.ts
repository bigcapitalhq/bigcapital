import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { templateRender } from '@/utils/template-render';

@Injectable()
export class TemplateInjectable {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Renders the given filename of the template.
   * @param {string} filename
   * @param {Record<string, any>} options
   * @returns {string}
   */
  public async render(filename: string, options: Record<string, any>) {
    const organization = await this.tenancyContext.getTenant(true);

    return templateRender(filename, {
      organizationName: organization.metadata.name,
      organizationEmail: organization.metadata.email,
      __: this.i18n.t,
      ...options,
    });
  }
}
