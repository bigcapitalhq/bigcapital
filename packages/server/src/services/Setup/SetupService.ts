import { Service, Inject } from 'typedi';
import Currencies from 'js-money/lib/currency';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { IOrganizationSetupDTO, ITenant } from '@/interfaces';

import CurrenciesService from '@/services/Currencies/CurrenciesService';
import TenantsManagerService from '@/services/Tenancy/TenantsManager';
import { ServiceError } from '@/exceptions';

const ERRORS = {
  TENANT_IS_ALREADY_SET_UP: 'TENANT_IS_ALREADY_SET_UP',
  BASE_CURRENCY_INVALID: 'BASE_CURRENCY_INVALID',
};

@Service()
export default class SetupService {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  currenciesService: CurrenciesService;

  @Inject()
  tenantsManager: TenantsManagerService;

  @Inject('repositories')
  sysRepositories: any;

  /**
   * Transformes the setup DTO to settings.
   * @param {IOrganizationSetupDTO} setupDTO
   * @returns
   */
  private transformSetupDTOToOptions(setupDTO: IOrganizationSetupDTO) {
    return [
      { key: 'name', value: setupDTO.organizationName },
      { key: 'base_currency', value: setupDTO.baseCurrency },
      { key: 'time_zone', value: setupDTO.timeZone },
      { key: 'industry', value: setupDTO.industry },
    ];
  }

  /**
   * Sets organization setup settings.
   * @param {number} tenantId
   * @param {IOrganizationSetupDTO} organizationSetupDTO
   */
  private setOrganizationSetupSettings(
    tenantId: number,
    organizationSetupDTO: IOrganizationSetupDTO
  ) {
    const settings = this.tenancy.settings(tenantId);

    // Can't continue if app is already configured.
    if (settings.get('app_configured')) { return; }

    settings.set([
      ...this.transformSetupDTOToOptions(organizationSetupDTO)
        .filter((option) => typeof option.value !== 'undefined')
        .map((option) => ({
          ...option,
          group: 'organization',
        })),
      { key: 'app_configured', value: true },
    ]);
  }

  /**
   * Validates the base currency code.
   * @param {string} baseCurrency 
   */
  public validateBaseCurrencyCode(baseCurrency: string) {
    if (typeof Currencies[baseCurrency] === 'undefined') {
      throw new ServiceError(ERRORS.BASE_CURRENCY_INVALID);
    }
  }

  /**
   * Organization setup DTO.
   * @param {IOrganizationSetupDTO} organizationSetupDTO
   * @return {Promise<void>}
   */
  public async organizationSetup(
    tenantId: number,
    organizationSetupDTO: IOrganizationSetupDTO,
  ): Promise<void> {
    const { tenantRepository } = this.sysRepositories;

    // Find tenant model by the given id.
    const tenant = await tenantRepository.findOneById(tenantId);

    // Validate base currency code.
    this.validateBaseCurrencyCode(organizationSetupDTO.baseCurrency);

    // Validate tenant not already seeded.
    this.validateTenantNotSeeded(tenant);

    // Seeds the base currency to the currencies list.
    this.currenciesService.seedBaseCurrency(
      tenantId,
      organizationSetupDTO.baseCurrency
    );
    // Sets organization setup settings.
    await this.setOrganizationSetupSettings(tenantId, organizationSetupDTO);

    // Seed tenant.
    await this.tenantsManager.seedTenant(tenant);
  }

  /**
   * Validates tenant not seeded.
   * @param {ITenant} tenant
   */
  private validateTenantNotSeeded(tenant: ITenant) {
    if (tenant.seededAt) {
      throw new ServiceError(ERRORS.TENANT_IS_ALREADY_SET_UP);
    }
  }
}
