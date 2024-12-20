import { Inject, Injectable } from '@nestjs/common';
import {
  ITaxRateActivatedPayload,
  ITaxRateActivatingPayload,
} from '../TaxRates.types';
import { Knex } from 'knex';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidator.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TaxRateModel } from '../models/TaxRate.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class InactivateTaxRateService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: CommandTaxRatesValidators,

    @Inject(TaxRateModel.name)
    private readonly taxRateModel: typeof TaxRateModel,
  ) {}

  /**
   * Edits the given tax rate.
   * @param {number} taxRateId
   * @returns {Promise<ITaxRate>}
   */
  public async inactivateTaxRate(taxRateId: number) {
    const oldTaxRate = await this.taxRateModel.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    // Validates the tax rate active.
    this.validators.validateTaxRateNotInactive(oldTaxRate);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateActivating` event.
      await this.eventEmitter.emitAsync(events.taxRates.onInactivating, {
        taxRateId,
        trx,
      } as ITaxRateActivatingPayload);

      const taxRate = await this.taxRateModel
        .query(trx)
        .findById(taxRateId)
        .patch({ active: false });

      // Triggers `onTaxRateCreated` event.
      await this.eventEmitter.emitAsync(events.taxRates.onInactivated, {
        taxRateId,
        trx,
      } as ITaxRateActivatedPayload);

      return taxRate;
    });
  }
}
