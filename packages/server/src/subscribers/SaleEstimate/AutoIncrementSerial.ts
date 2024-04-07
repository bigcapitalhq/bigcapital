import { ISaleEstimateCreatedPayload } from '@/interfaces';
import SettingsService from '@/services/Settings/SettingsService';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class SaleEstimateAutoSerialSubscriber {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  settingsService: SettingsService;

  /**
   * Attaches events to handles.events.saleEstimate.onCreated
   */
  public attach(bus) {
    bus.subscribe(events.saleEstimate.onCreated, this.handleEstimateNextNumberIncrement);
  }

  /**
   * Handle sale estimate increment next number once be created.
   */
  private handleEstimateNextNumberIncrement = async ({
    tenantId,
    saleEstimateId,
    trx,
  }: ISaleEstimateCreatedPayload) => {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'sales_estimates',
    });
  };
}
