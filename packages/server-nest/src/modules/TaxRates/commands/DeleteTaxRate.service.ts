import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ITaxRateDeletedPayload,
  ITaxRateDeletingPayload,
} from '../TaxRates.types';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidator.service';
import { TaxRateModel } from '../models/TaxRate.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class DeleteTaxRateService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: CommandTaxRatesValidators,

    @Inject(TaxRateModel.name)
    private readonly taxRateModel: typeof TaxRateModel,
  ) {}

  /**
   * Deletes the given tax rate.
   * @param {number} taxRateId
   * @returns {Promise<void>}
   */
  public async deleteTaxRate(taxRateId: number): Promise<void> {
    const oldTaxRate = await this.taxRateModel.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateDeleting` event.
      await this.eventEmitter.emitAsync(events.taxRates.onDeleting, {
        oldTaxRate,
        trx,
      } as ITaxRateDeletingPayload);

      await this.taxRateModel.query(trx).findById(taxRateId).delete();

      // Triggers `onTaxRateDeleted` event.
      await this.eventEmitter.emitAsync(events.taxRates.onDeleted, {
        oldTaxRate,
        trx,
      } as ITaxRateDeletedPayload);
    });
  }
}
