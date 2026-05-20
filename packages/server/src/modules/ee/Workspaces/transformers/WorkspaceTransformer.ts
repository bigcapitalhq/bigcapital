import { Transformer } from '@/modules/Transformer/Transformer';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { WorkspaceDto } from '../dtos/WorkspaceResponse.dto';

/**
 * Transforms UserTenant (workspace membership) to WorkspaceDto.
 */
export class WorkspaceTransformer extends Transformer<UserTenant> {
  /**
   * Include these attributes in the transformed output.
   */
  public includeAttributes = (): string[] => {
    return [
      'organizationId',
      'isReady',
      'isBuildRunning',
      'isDeleting',
      'isActive',
      'buildJobId',
      'metadata',
      'isDefault',
      'totalIncome',
      'totalExpenses',
      'totalAssets',
      'totalLiabilities',
      'formattedTotalAssets',
      'formattedTotalLiabilities',
    ];
  };

  /**
   * Extract organizationId from tenant relation.
   */
  protected organizationId = (membership: UserTenant): string => {
    return membership.tenant?.organizationId;
  };

  /**
   * Extract isReady from tenant relation.
   */
  protected isReady = (membership: UserTenant): boolean => {
    return membership.tenant?.isReady ?? false;
  };

  /**
   * Extract isBuildRunning from tenant relation.
   */
  protected isBuildRunning = (membership: UserTenant): boolean => {
    return membership.tenant?.isBuildRunning ?? false;
  };

  /**
   * Extract isDeleting from tenant relation.
   */
  protected isDeleting = (membership: UserTenant): boolean => {
    return membership.tenant?.isDeleting ?? false;
  };

  /**
   * Extract isActive from tenant relation.
   */
  protected isActive = (membership: UserTenant): boolean => {
    return membership.tenant?.isActive ?? false;
  };

  /**
   * Extract buildJobId from tenant relation.
   */
  protected buildJobId = (membership: UserTenant): string | undefined => {
    return membership.tenant?.buildJobId ?? undefined;
  };

  /**
   * Transform metadata from tenant relation.
   */
  protected metadata = (membership: UserTenant) => {
    const metadata = membership.tenant?.metadata;
    if (!metadata) return undefined;

    const organizationId = membership.tenant?.organizationId;
    const logoUri = organizationId
      ? this.options?.logoUris?.[organizationId]
      : null;

    return {
      name: metadata.name,
      baseCurrency: metadata.baseCurrency,
      industry: metadata.industry,
      location: metadata.location,
      timezone: metadata.timezone,
      language: metadata.language,
      logoKey: metadata.logoKey || null,
      logoUri,
    };
  };

  /**
   * Determine if this workspace is the user's default.
   */
  protected isDefault = (membership: UserTenant): boolean => {
    const defaultTenantId = this.options?.defaultTenantId;
    if (!defaultTenantId) return false;
    return membership.tenantId === defaultTenantId;
  };

  /**
   * Get total income from financial data.
   */
  protected totalIncome = (): undefined => {
    return undefined;
  };

  /**
   * Get total expenses from financial data.
   */
  protected totalExpenses = (): undefined => {
    return undefined;
  };

  /**
   * Get total assets from financial data.
   */
  protected totalAssets = (): undefined => {
    return undefined;
  };

  /**
   * Get total liabilities from financial data.
   */
  protected totalLiabilities = (): undefined => {
    return undefined;
  };

  /**
   * Get formatted total assets.
   */
  protected formattedTotalAssets = (): string => {
    return '-';
  };

  /**
   * Get formatted total liabilities.
   */
  protected formattedTotalLiabilities = (): string => {
    return '-';
  };

  /**
   * Transform single membership to WorkspaceDto.
   */
  transform = (membership: UserTenant): WorkspaceDto => {
    return {
      organizationId: this.organizationId(membership),
      isReady: this.isReady(membership),
      isBuildRunning: this.isBuildRunning(membership),
      isDeleting: this.isDeleting(membership),
      isActive: this.isActive(membership),
      buildJobId: this.buildJobId(membership),
      role: membership.role,
      isDefault: this.isDefault(membership),
      metadata: this.metadata(membership),
      totalIncome: this.totalIncome(),
      totalExpenses: this.totalExpenses(),
      totalAssets: this.totalAssets(),
      totalLiabilities: this.totalLiabilities(),
      formattedTotalAssets: this.formattedTotalAssets(),
      formattedTotalLiabilities: this.formattedTotalLiabilities(),
    };
  };

  /**
   * Process collections directly through transform, then apply
   * post-collection filtering and sorting.
   */
  public work = (object: any) => {
    if (Array.isArray(object)) {
      const transformed = object.map((item) => this.transform(item));
      return this.postCollectionTransform(transformed);
    }
    return this.transform(object);
  };

  /**
   * Filter and sort the transformed workspaces collection.
   */
  protected postCollectionTransform = (
    workspaces: WorkspaceDto[],
  ): WorkspaceDto[] => {
    let result = workspaces;

    if (!this.options?.includeInactive) {
      result = result.filter((w) => w.isActive);
    }

    return result.sort((a, b) => {
      const currentOrganizationId = this.options?.currentOrganizationId as string;
      if (currentOrganizationId) {
        if (a.organizationId === currentOrganizationId) return -1;
        if (b.organizationId === currentOrganizationId) return 1;
      }
      return (a.metadata?.name || a.organizationId).localeCompare(
        b.metadata?.name || b.organizationId,
      );
    });
  };
}
