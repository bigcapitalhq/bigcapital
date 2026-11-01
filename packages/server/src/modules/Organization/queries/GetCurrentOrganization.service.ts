import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { throwIfTenantNotExists } from '../Organization/_utils';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { Injectable } from '@nestjs/common';
import { ModelObject } from 'objection';
import { GetAttachmentPresignedUrl } from '@/modules/Attachments/GetAttachmentPresignedUrl';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetCurrentOrganizationTransformer } from './GetCurrentOrganization.transformer';

@Injectable()
export class GetCurrentOrganizationService {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly getPresignedUrlService: GetAttachmentPresignedUrl,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve the current organization metadata.
   * @returns {Promise<ITenant[]>}
   */
  async getCurrentOrganization(): Promise<ModelObject<TenantModel>> {
    const tenant = await this.tenancyContext
      .getTenant()
      .withGraphFetched('subscriptions')
      .withGraphFetched('metadata');

    throwIfTenantNotExists(tenant);

    const logoUri = tenant.metadata?.logoKey
      ? await this.getPresignedUrlService.getPresignedUrl(
          tenant.metadata.logoKey,
        )
      : null;

    return await this.transformer.transform(
      tenant,
      new GetCurrentOrganizationTransformer(),
      { logoUri },
    );
  }
}
