import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { IOrganizationBuildEventPayload } from '@/interfaces';
import { InitialCurrenciesSeed } from '../InitialCurrenciesSeed';

@Service()
export class SeedInitialCurrenciesOnSetupSubscriber {
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
  private seedInitialCurrenciesOnBuild = async ({
    systemUser,
    buildDTO,
    tenantId,
  }: IOrganizationBuildEventPayload) => {
    await this.seedInitialCurrencies.seedInitialCurrencies(
      tenantId,
      buildDTO.baseCurrency
    );
  };
}
