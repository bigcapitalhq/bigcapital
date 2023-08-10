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
   *
   * @param tenantId
   * @param taxRateId
   */
  public deleteTaxRate(tenantId: number, taxRateId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const oldTaxRate = TaxRate.query().findById(taxRateId);

    this.validators.validateTaxRateExistance(oldTaxRate);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceCreating` event.
      await this.eventPublisher.emitAsync(events.taxRates.onDeleting, {
        oldTaxRate,
        tenantId,
        trx,
      } as ITaxRateDeletingPayload);

      await TaxRate.query(trx).findById(taxRateId).delete();

      //
      await this.eventPublisher.emitAsync(events.taxRates.onDeleted, {
        oldTaxRate,
        tenantId,
        trx,
      } as ITaxRateDeletedPayload);
    });
  }
}
