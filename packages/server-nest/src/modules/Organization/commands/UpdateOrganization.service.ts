import { TenancyContext } from "@/modules/Tenancy/TenancyContext.service";
import { UpdateOrganizationDto } from "../dtos/Organization.dto";
import { throwIfTenantNotExists } from "../Organization/_utils";


export class UpdateOrganizationService {
  constructor(
    private readonly tenancyContext: TenancyContext
  ) {

  }

  /**
   * Updates organization information.
   * @param {ITenant} tenantId
   * @param {IOrganizationUpdateDTO} organizationDTO
   */
  public async execute(
    organizationDTO: UpdateOrganizationDto,
  ): Promise<void> {
    const tenant = await this.tenancyContext.getTenant(true);

    // Throw error if the tenant not exists.
    throwIfTenantNotExists(tenant);

    // Validate organization transactions before mutate base currency.
    if (organizationDTO.baseCurrency) {
      await this.validateMutateBaseCurrency(
        tenant,
        organizationDTO.baseCurrency,
        tenant.metadata?.baseCurrency,
      );
    }
    await tenant.saveMetadata(organizationDTO);

    if (organizationDTO.baseCurrency !== tenant.metadata?.baseCurrency) {
      // Triggers `onOrganizationBaseCurrencyUpdated` event.
      await this.eventPublisher.emitAsync(
        events.organization.baseCurrencyUpdated,
        {
          tenantId,
          organizationDTO,
        },
      );
    }
  }
}