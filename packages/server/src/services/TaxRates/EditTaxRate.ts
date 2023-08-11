import {
  IEditTaxRateDTO,
  ITaxRateCreatingPayload,
  ITaxRateEditedPayload,
  ITaxRateEditingPayload,
} from '@/interfaces';
import { Inject } from 'typedi';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '../Tenancy/TenancyService';
import { Knex } from 'knex';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';
import events from '@/subscribers/events';

export class EditTaxRateService {
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
  public editTaxRate(
    tenantId: number,
    taxRateId: number,
    editTaxRateDTO: IEditTaxRateDTO
  ) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const oldTaxRate = TaxRate.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateCreating` event.
      await this.eventPublisher.emitAsync(events.taxRates.onCreating, {
        editTaxRateDTO,
        tenantId,
        trx,
      } as ITaxRateEditingPayload);

      const taxRate = await TaxRate.query(trx)
        .findById(taxRateId)
        .patch({ ...editTaxRateDTO });

      // Triggers `onTaxRateCreated` event.
      await this.eventPublisher.emitAsync(events.taxRates.onCreated, {
        editTaxRateDTO,
        taxRate,
        tenantId,
        trx,
      } as ITaxRateEditedPayload);

      return taxRate;
    });
  }
}
