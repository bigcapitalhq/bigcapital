import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import {
  IEditTaxRateDTO,
  ITaxRate,
  ITaxRateEditedPayload,
  ITaxRateEditingPayload,
} from '@/interfaces';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '../Tenancy/TenancyService';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';
import events from '@/subscribers/events';

@Service()
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
   * Detarmines whether the tax rate, name or code have been changed.
   * @param {ITaxRate} taxRate
   * @param {IEditTaxRateDTO} editTaxRateDTO
   * @returns {boolean}
   */
  private isTaxRateDTOChanged = (
    taxRate: ITaxRate,
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
    tenantId: number,
    oldTaxRate: ITaxRate,
    editTaxRateDTO: IEditTaxRateDTO,
    trx?: Knex.Transaction
  ) {
    const { TaxRate } = this.tenancy.models(tenantId);
    const isTaxDTOChanged = this.isTaxRateDTOChanged(
      oldTaxRate,
      editTaxRateDTO
    );
    if (isTaxDTOChanged) {
      // Soft deleting the old tax rate.
      await TaxRate.query(trx).findById(oldTaxRate.id).delete();

      // Create a new tax rate with new edited data.
      return TaxRate.query(trx).insertAndFetch({
        ...omit(oldTaxRate, ['id']),
        ...editTaxRateDTO,
      });
    } else {
      return TaxRate.query(trx).patchAndFetchById(oldTaxRate.id, {
        ...editTaxRateDTO,
      });
    }
  }

  /**
   * Edits the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @param {IEditTaxRateDTO} taxRateEditDTO
   * @returns {Promise<ITaxRate>}
   */
  public async editTaxRate(
    tenantId: number,
    taxRateId: number,
    editTaxRateDTO: IEditTaxRateDTO
  ) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const oldTaxRate = await TaxRate.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(oldTaxRate);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTaxRateEditing` event.
      await this.eventPublisher.emitAsync(events.taxRates.onEditing, {
        editTaxRateDTO,
        tenantId,
        trx,
      } as ITaxRateEditingPayload);

      const taxRate = await this.editTaxRateOrCreate(
        tenantId,
        oldTaxRate,
        editTaxRateDTO,
        trx
      );
      // Triggers `onTaxRateEdited` event.
      await this.eventPublisher.emitAsync(events.taxRates.onEdited, {
        editTaxRateDTO,
        oldTaxRate,
        taxRate,
        tenantId,
        trx,
      } as ITaxRateEditedPayload);

      return taxRate;
    });
  }
}
