import { Injectable } from '@nestjs/common';
import { CommonOrganizationBrandingAttributes } from '../types';
import { TenancyContext } from '../../Tenancy/TenancyContext.service';

@Injectable()
export class GetOrganizationBrandingAttributesService {
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Retrieves the given organization branding attributes initial state.
   * @returns {Promise<CommonOrganizationBrandingAttributes>}
   */
  public async getOrganizationBrandingAttributes(): Promise<CommonOrganizationBrandingAttributes> {
    const tenant = await this.tenancyContext.getTenant(true);
    const tenantMetadata = tenant.metadata;

    const companyName = tenantMetadata?.name;
    const primaryColor = tenantMetadata?.primaryColor;
    const companyLogoKey = tenantMetadata?.logoKey;
    const companyLogoUri = tenantMetadata?.logoUri;
    const companyAddress = tenantMetadata?.addressTextFormatted;

    return {
      companyName,
      companyAddress,
      companyLogoUri,
      companyLogoKey,
      primaryColor,
    };
  }
}
