import { ICreateTaxRateDTO, ITaxRateCreatedPayload, ITaxRateCreatingPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';

@Service()
export class CreateTaxRate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: CommandTaxRatesValidators;

  /**
   * Creates a new tax rate.
   * @param {number} tenantId
   * @param {ICreateTaxRateDTO} createTaxRateDTO
   */
  public async createTaxRate(tenantId: number, createTaxRateDTO: ICreateTaxRateDTO) {
    const { TaxRate } = this.tenancy.models(tenantId);

    // Validates the tax code uniquiness.
    await this.validators.validateTaxCodeUnique(tenantId, createTaxRateDTO.code);
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateCreating` event.
      await this.eventPublisher.emitAsync(events.taxRates.onCreating, {
        createTaxRateDTO,
        tenantId,
        trx,
      } as ITaxRateCreatingPayload);

      const taxRate = await TaxRate.query(trx).insertAndFetch({
        ...createTaxRateDTO,
      });

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
