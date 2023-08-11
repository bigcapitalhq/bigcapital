import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ITaxRateDeletedPayload, ITaxRateDeletingPayload } from '@/interfaces';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '../Tenancy/TenancyService';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';
import events from '@/subscribers/events';

@Service()
export class DeleteTaxRateService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: CommandTaxRatesValidators;

  /**
   * Deletes the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns {Promise<void>}
   */
  public deleteTaxRate(tenantId: number, taxRateId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const oldTaxRate = TaxRate.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateDeleting` event.
      await this.eventPublisher.emitAsync(events.taxRates.onDeleting, {
        oldTaxRate,
        tenantId,
        trx,
      } as ITaxRateDeletingPayload);

      await TaxRate.query(trx).findById(taxRateId).delete();

      // Triggers `onTaxRateDeleted` event.
      await this.eventPublisher.emitAsync(events.taxRates.onDeleted, {
        oldTaxRate,
        tenantId,
        trx,
      } as ITaxRateDeletedPayload);
    });
  }
}
