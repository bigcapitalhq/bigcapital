import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import {
  ITaxRateActivatedPayload,
  ITaxRateActivatingPayload,
} from '@/interfaces';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '../Tenancy/TenancyService';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';
import events from '@/subscribers/events';

@Service()
export class ActivateTaxRateService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: CommandTaxRatesValidators;

  /**
   * Activates the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @param {IEditTaxRateDTO} taxRateEditDTO
   * @returns {Promise<ITaxRate>}
   */
  public activateTaxRate(tenantId: number, taxRateId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const oldTaxRate = TaxRate.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    // Validates the tax rate inactive.
    this.validators.validateTaxRateNotActive(oldTaxRate);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateActivating` event.
      await this.eventPublisher.emitAsync(events.taxRates.onActivating, {
        taxRateId,
        tenantId,
        trx,
      } as ITaxRateActivatingPayload);

      const taxRate = await TaxRate.query(trx)
        .findById(taxRateId)
        .patch({ active: 1 });

      // Triggers `onTaxRateCreated` event.
      await this.eventPublisher.emitAsync(events.taxRates.onActivated, {
        taxRateId,
        tenantId,
        trx,
      } as ITaxRateActivatedPayload);

      return taxRate;
    });
  }
}
