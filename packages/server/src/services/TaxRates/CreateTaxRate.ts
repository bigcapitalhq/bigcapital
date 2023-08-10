import { Knex } from 'knex';
import {
  ICreateTaxRateDTO,
  ITaxRateCreatedPayload,
  ITaxRateCreatingPayload,
} from '@/interfaces';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '../Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';

@Service()
export class CreateTaxRate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Creates a new tax rate.
   * @param {number} tenantId
   * @param {ICreateTaxRateDTO} createTaxRateDTO
   */
  public createTaxRate(tenantId: number, createTaxRateDTO: ICreateTaxRateDTO) {
    const { TaxRate } = this.tenancy.models(tenantId);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateCreating` event.
      await this.eventPublisher.emitAsync(events.taxRates.onCreating, {
        createTaxRateDTO,
        tenantId,
        trx,
      } as ITaxRateCreatingPayload);

      const taxRate = await TaxRate.query(trx).insert({ ...createTaxRateDTO });

      // Triggers `onTaxRateCreated` event.
      await this.eventPublisher.emitAsync(events.taxRates.onCreated, {
        createTaxRateDTO,
        taxRate,
        tenantId,
        trx,
      } as ITaxRateCreatedPayload);

      return taxRate;
    });
  }
}
