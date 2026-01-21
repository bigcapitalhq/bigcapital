import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UpdateOrganizationDto } from '../dtos/Organization.dto';
import { throwIfTenantNotExists } from '../Organization/_utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { CommandOrganizationValidators } from './CommandOrganizationValidators.service';
import { TenantRepository } from '@/modules/System/repositories/Tenant.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateOrganizationService {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly commandOrganizationValidators: CommandOrganizationValidators,
    private readonly tenantRepository: TenantRepository,
  ) { }

  /**
   * Updates organization information.
   * @param {UpdateOrganizationDto} organizationDTO
   */
  public async execute(organizationDTO: UpdateOrganizationDto): Promise<void> {
    const tenant = await this.tenancyContext.getTenant(true);

    // Throw error if the tenant not exists.
    throwIfTenantNotExists(tenant);

    // Validate organization transactions before mutate base currency.
    if (organizationDTO.baseCurrency) {
      await this.commandOrganizationValidators.validateMutateBaseCurrency(
        tenant,
        organizationDTO.baseCurrency,
        tenant.metadata?.baseCurrency,
      );
    }
    await this.tenantRepository.saveMetadata(tenant.id, organizationDTO);

    if (organizationDTO.baseCurrency !== tenant.metadata?.baseCurrency) {
      // Triggers `onOrganizationBaseCurrencyUpdated` event.
      await this.eventEmitter.emitAsync(
        events.organization.baseCurrencyUpdated,
        {
          organizationDTO,
        },
      );
    }
  }
}
