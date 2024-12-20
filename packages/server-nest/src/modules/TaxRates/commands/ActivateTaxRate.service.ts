import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ITaxRateActivatedPayload,
  ITaxRateActivatingPayload,
} from '../TaxRates.types';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TaxRateModel } from '../models/TaxRate.model';
import { events } from '@/common/events/events';

@Injectable()
export class ActivateTaxRateService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: CommandTaxRatesValidators,

    @Inject(TaxRateModel.name)
    private readonly taxRateModel: typeof TaxRateModel,
  ) {}

  /**
   * Activates the given tax rate.
   * @param {number} taxRateId
   * @returns {Promise<ITaxRate>}
   */
  public async activateTaxRate(taxRateId: number) {
    const oldTaxRate = await this.taxRateModel.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    // Validates the tax rate inactive.
    this.validators.validateTaxRateNotActive(oldTaxRate);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateActivating` event.
      await this.eventEmitter.emitAsync(events.taxRates.onActivating, {
        taxRateId,
        trx,
      } as ITaxRateActivatingPayload);

      const taxRate = await this.taxRateModel
        .query(trx)
        .findById(taxRateId)
        .patch({ active: true });

      // Triggers `onTaxRateCreated` event.
      await this.eventEmitter.emitAsync(events.taxRates.onActivated, {
        taxRateId,
        trx,
      } as ITaxRateActivatedPayload);

      return taxRate;
    });
  }
}
