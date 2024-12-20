import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { omit } from 'lodash';
import {
  IEditTaxRateDTO,
  ITaxRateEditedPayload,
  ITaxRateEditingPayload,
} from '../TaxRates.types';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidator.service';
import { TaxRateModel } from '../models/TaxRate.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EditTaxRateService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: CommandTaxRatesValidators,

    @Inject(TaxRateModel.name)
    private readonly taxRateModel: typeof TaxRateModel,
  ) {}

  /**
   * Detarmines whether the tax rate, name or code have been changed.
   * @param {ITaxRate} taxRate
   * @param {IEditTaxRateDTO} editTaxRateDTO
   * @returns {boolean}
   */
  private isTaxRateDTOChanged = (
    taxRate: TaxRateModel,
    editTaxRateDTO: IEditTaxRateDTO
  ) => {
    return (
      taxRate.rate !== editTaxRateDTO.rate ||
      taxRate.name !== editTaxRateDTO.name ||
      taxRate.code !== editTaxRateDTO.code
    );
  };

  /**
   * Edits the given tax rate or creates a new if the rate or name have been changed.
   * @param {number} tenantId
   * @param {ITaxRate} oldTaxRate
   * @param {IEditTaxRateDTO} editTaxRateDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<ITaxRate>}
   */
  private async editTaxRateOrCreate(
    oldTaxRate: TaxRateModel,
    editTaxRateDTO: IEditTaxRateDTO,
    trx?: Knex.Transaction
  ) {
    const isTaxDTOChanged = this.isTaxRateDTOChanged(
      oldTaxRate,
      editTaxRateDTO
    );
    if (isTaxDTOChanged) {
      // Soft deleting the old tax rate.
      await this.taxRateModel.query(trx).findById(oldTaxRate.id).delete();

      // Create a new tax rate with new edited data.
      return this.taxRateModel.query(trx).insertAndFetch({
        ...omit(oldTaxRate, ['id']),
        ...editTaxRateDTO,
      });
    } else {
      return this.taxRateModel.query(trx).patchAndFetchById(oldTaxRate.id, {
        ...editTaxRateDTO,
      });
    }
  }

  public async editTaxRate(
    taxRateId: number,
    editTaxRateDTO: IEditTaxRateDTO
  ) {
    const oldTaxRate = await this.taxRateModel.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateEditing` event.
      await this.eventEmitter.emitAsync(events.taxRates.onEditing, {
        editTaxRateDTO,
        trx,
      } as ITaxRateEditingPayload);

      const taxRate = await this.editTaxRateOrCreate(
        oldTaxRate,
        editTaxRateDTO,
        trx
      );
      // Triggers `onTaxRateEdited` event.
      await this.eventEmitter.emitAsync(events.taxRates.onEdited, {
        editTaxRateDTO,
        oldTaxRate,
        taxRate,
        trx,
      } as ITaxRateEditedPayload);

      return taxRate;
    });
  }
}
