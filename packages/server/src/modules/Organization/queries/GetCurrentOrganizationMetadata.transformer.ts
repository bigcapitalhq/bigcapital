import { Transformer } from '@/modules/Transformer/Transformer';

export class GetCurrentOrganizationMetadataTransformer extends Transformer {
  /**
   * Include these attributes in the metadata response.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['logoUri'];
  };

  /**
   * Logo URI (presigned or public URL) for display.
   * Provided via options from the service after resolving logoKey.
   * @param metadata
   * @returns {string | null}
   */
  public logoUri = (_metadata: Record<string, any>): string | null => {
    return this.options?.logoUri ?? null;
  };
}
