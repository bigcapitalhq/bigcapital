import { ITaxRateActivatedPayload, ITaxRateActivatingPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';

@Service()
export class InactivateTaxRateService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: CommandTaxRatesValidators;

  /**
   * Edits the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @param {IEditTaxRateDTO} taxRateEditDTO
   * @returns {Promise<ITaxRate>}
   */
  public async inactivateTaxRate(tenantId: number, taxRateId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const oldTaxRate = await TaxRate.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    // Validates the tax rate active.
    this.validators.validateTaxRateNotInactive(oldTaxRate);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateActivating` event.
      await this.eventPublisher.emitAsync(events.taxRates.onInactivating, {
        taxRateId,
        tenantId,
        trx,
      } as ITaxRateActivatingPayload);

      const taxRate = await TaxRate.query(trx).findById(taxRateId).patch({ active: 0 });

      // Triggers `onTaxRateCreated` event.
      await this.eventPublisher.emitAsync(events.taxRates.onInactivated, {
        taxRateId,
        tenantId,
        trx,
      } as ITaxRateActivatedPayload);

      return taxRate;
    });
  }
}
