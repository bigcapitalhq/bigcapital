import { Inject, Injectable } from '@nestjs/common';
import { TenantMetadata } from '@/modules/System/models/TenantMetadataModel';
import { TenantModel } from '@/modules/System/models/TenantModel';

/**
 * How long the "require two-factor" flag of an organization is cached in
 * memory, as it is read on every signed-in request.
 */
const CACHE_TTL_MS = 30 * 1000;

/**
 * The organization setting "require two-factor authentication for all users"
 * (`tenants_metadata.require_two_factor`).
 */
@Injectable()
export class TwoFactorPolicyService {
  private readonly cache = new Map<string, { value: boolean; at: number }>();

  constructor(
    @Inject(TenantMetadata.name)
    private readonly tenantMetadataModel: typeof TenantMetadata,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) {}

  /**
   * Whether the tenant requires two-factor authentication.
   */
  public async isRequiredForTenant(tenantId: number): Promise<boolean> {
    const metadata = await this.tenantMetadataModel
      .query()
      .findOne({ tenantId });

    return !!metadata?.requireTwoFactor;
  }

  /**
   * Whether the organization requires two-factor authentication (cached).
   */
  public async isRequiredForOrganization(
    organizationId: string,
  ): Promise<boolean> {
    const cached = this.cache.get(organizationId);

    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return cached.value;
    }
    const tenant = await this.tenantModel.query().findOne({ organizationId });
    const value = tenant ? await this.isRequiredForTenant(tenant.id) : false;

    if (this.cache.size > 10000) {
      this.cache.clear();
    }
    this.cache.set(organizationId, { value, at: Date.now() });
    return value;
  }

  /**
   * Turns the requirement on or off for the organization.
   */
  public async setRequired(
    tenantId: number,
    organizationId: string,
    required: boolean,
  ): Promise<void> {
    await this.tenantMetadataModel
      .query()
      .patch({ requireTwoFactor: !!required })
      .where('tenantId', tenantId);

    this.cache.delete(organizationId);
  }
}
