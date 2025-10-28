import { Injectable } from '@nestjs/common';
import { GetOrganizationBrandingAttributesService } from './GetOrganizationBrandingAttributes.service';

@Injectable()
export class GetPdfTemplateBrandingState {
  constructor(
    private readonly getOrgBrandingAttributes: GetOrganizationBrandingAttributesService,
  ) {}

  async execute() {
    const brandingAttributes =
      await this.getOrgBrandingAttributes.execute();

    return brandingAttributes;
  }
}
