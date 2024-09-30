import { Service } from 'typedi';
import { TenantMetadata } from '@/system/models';
import { CommonOrganizationBrandingAttributes } from './types';

@Service()
export class GetOrganizationBrandingAttributes {
  /**
   * Retrieves the given organization branding attributes initial state.
   * @param {number} tenantId
   * @returns {Promise<CommonOrganizationBrandingAttributes>}
   */
  async getOrganizationBrandingAttributes(
    tenantId: number
  ): Promise<CommonOrganizationBrandingAttributes> {
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

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
