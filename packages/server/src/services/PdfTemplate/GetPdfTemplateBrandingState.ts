import { Inject, Service } from 'typedi';
import { GetOrganizationBrandingAttributes } from './GetOrganizationBrandingAttributes';

@Service()
export class GetPdfTemplateBrandingState {
  @Inject()
  private getOrgBrandingAttributes: GetOrganizationBrandingAttributes;

  getBrandingState(tenantId: number) {
    const brandingAttributes =
      this.getOrgBrandingAttributes.getOrganizationBrandingAttributes(tenantId);

    return brandingAttributes;
  }
}
