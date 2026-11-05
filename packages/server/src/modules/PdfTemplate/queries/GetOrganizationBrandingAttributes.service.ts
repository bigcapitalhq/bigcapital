import { Injectable } from '@nestjs/common';
import { CommonOrganizationBrandingAttributes } from '../types';
import { TenancyContext } from '../../Tenancy/TenancyContext.service';
import { GetAttachmentPresignedUrl } from '@/modules/Attachments/GetAttachmentPresignedUrl';

@Injectable()
export class GetOrganizationBrandingAttributesService {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly getPresignedUrlService: GetAttachmentPresignedUrl,
  ) {}

  /**
   * Retrieves the given organization branding attributes initial state.
   * @returns {Promise<CommonOrganizationBrandingAttributes>}
   */
  public async execute(): Promise<CommonOrganizationBrandingAttributes> {
    const tenant = await this.tenancyContext.getTenant(true);
    const tenantMetadata = tenant.metadata;

    const companyName = tenantMetadata?.name;
    const primaryColor = tenantMetadata?.primaryColor;
    const companyLogoKey = tenantMetadata?.logoKey;
    const companyAddress = tenantMetadata?.addressTextFormatted;
    const companyTaxNumber = tenantMetadata?.taxNumber ?? '';

    let companyLogoUri: string | null = null;
    if (companyLogoKey) {
      try {
        companyLogoUri =
          await this.getPresignedUrlService.getPresignedUrl(companyLogoKey);
      } catch {
        companyLogoUri = null;
      }
    }

    return {
      companyName,
      companyAddress,
      companyTaxNumber,
      companyLogoUri: companyLogoUri ?? undefined,
      companyLogoKey,
      primaryColor,
    };
  }
}
