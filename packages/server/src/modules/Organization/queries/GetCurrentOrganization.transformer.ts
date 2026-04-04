import { Transformer } from '@/modules/Transformer/Transformer';
import { GetCurrentOrganizationMetadataTransformer } from './GetCurrentOrganizationMetadata.transformer';

export class GetCurrentOrganizationTransformer extends Transformer {
  /**
   * Transforms the tenant/organization for the current-organization response.
   * Delegates metadata transformation to GetCurrentOrganizationMetadataTransformer
   * and injects the pre-computed logoUri from options.
   */
  transform = (tenant: Record<string, any>) => {
    const metadataTransformer = new GetCurrentOrganizationMetadataTransformer();
    const transformedMetadata = this.item(
      tenant.metadata,
      metadataTransformer,
      {
        logoUri: this.options?.logoUri,
      },
    );

    return {
      ...tenant,
      metadata: transformedMetadata,
    };
  };
}
