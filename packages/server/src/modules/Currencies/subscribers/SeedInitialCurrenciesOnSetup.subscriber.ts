import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { InitialCurrenciesSeedService } from '../commands/InitialCurrenciesSeed.service';
import { IOrganizationBuildEventPayload } from '@/modules/Organization/Organization.types';
import { events } from '@/common/events/events';

@Injectable()
export class SeedInitialCurrenciesOnSetupSubsriber {
  constructor(
    private readonly seedInitialCurrencies: InitialCurrenciesSeedService,
  ) {}

  /**
   * Seed initial currencies once organization build.
   * @param {IOrganizationBuildEventPayload}
   */
  @OnEvent(events.organization.build)
  async seedInitialCurrenciesOnBuild({
    systemUser,
    buildDTO,
  }: IOrganizationBuildEventPayload) {
    await this.seedInitialCurrencies.seedInitialCurrencies(
      buildDTO.baseCurrency,
    );
  }
}
