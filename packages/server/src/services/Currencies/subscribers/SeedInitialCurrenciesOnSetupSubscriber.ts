import { IOrganizationBuildEventPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { InitialCurrenciesSeed } from '../InitialCurrenciesSeed';

@Service()
export class SeedInitialCurrenciesOnSetupSubsriber {
  @Inject()
  seedInitialCurrencies: InitialCurrenciesSeed;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(events.organization.build, this.seedInitialCurrenciesOnBuild);
  }

  /**
   * Seed initial currencies once organization build.
   * @param {IOrganizationBuildEventPayload}
   */
  private seedInitialCurrenciesOnBuild = async ({ systemUser, buildDTO, tenantId }: IOrganizationBuildEventPayload) => {
    await this.seedInitialCurrencies.seedInitialCurrencies(tenantId, buildDTO.baseCurrency);
  };
}
