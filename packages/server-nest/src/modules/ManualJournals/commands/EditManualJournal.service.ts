import { Knex } from 'knex';
import { omit, sumBy } from 'lodash';
import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import {
  IManualJournalDTO,
  IManualJournalEventEditedPayload,
  IManualJournalEditingPayload,
} from '../types/ManualJournals.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CommandManualJournalValidators } from './CommandManualJournalValidators.service';
import { events } from '@/common/events/events';
import { ManualJournal } from '../models/ManualJournal';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditManualJournal {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private validator: CommandManualJournalValidators,

    @Inject(ManualJournal.name)
    private manualJournalModel: TenantModelProxy<typeof ManualJournal>,
  ) {}

  /**
   * Authorize the manual journal editing.
   * @param {number} manualJournalId - Manual journal id.
   * @param {IManualJournalDTO} manualJournalDTO - Manual journal DTO.
   */
  private authorize = async (
    manualJournalId: number,
    manualJournalDTO: IManualJournalDTO,
  ) => {
    // Validates the total credit and debit to be equals.
    this.validator.valdiateCreditDebitTotalEquals(manualJournalDTO);

    // Validate the contacts existance.
    await this.validator.validateContactsExistance(manualJournalDTO);

    // Validates entries accounts existance.
    await this.validator.validateAccountsExistance(manualJournalDTO);

    // Validates the manual journal number uniquiness.
    if (manualJournalDTO.journalNumber) {
      await this.validator.validateManualJournalNoUnique(
        manualJournalDTO.journalNumber,
        manualJournalId,
      );
    }
    // Validate accounts with contact type from the given config.
    await this.validator.dynamicValidateAccountsWithContactType(
      manualJournalDTO.entries,
    );
  };

  /**
   * Transform the edit manual journal DTO to upsert graph operation.
   * @param {IManualJournalDTO} manualJournalDTO - Manual jorunal DTO.
   * @param {IManualJournal} oldManualJournal
   */
  private transformEditDTOToModel = (
    manualJournalDTO: IManualJournalDTO,
    oldManualJournal: ManualJournal,
  ) => {
    const amount = sumBy(manualJournalDTO.entries, 'credit') || 0;
    const date = moment(manualJournalDTO.date).format('YYYY-MM-DD');

    return {
      id: oldManualJournal.id,
      ...omit(manualJournalDTO, ['publish', 'attachments']),
      ...(manualJournalDTO.publish && !oldManualJournal.publishedAt
        ? { publishedAt: moment().toMySqlDateTime() }
        : {}),
      amount,
      date,
    };
  };

  /**
   * Edits jouranl entries.
   * @param {number} manualJournalId - Manual journal id.
   * @param {IMakeJournalDTO} manualJournalDTO - Manual journal DTO.
   */
  public async editJournalEntries(
    manualJournalId: number,
    manualJournalDTO: IManualJournalDTO,
  ): Promise<{
    manualJournal: ManualJournal;
    oldManualJournal: ManualJournal;
  }> {
    // Validates the manual journal existance on the storage.
    const oldManualJournal = await this.manualJournalModel()
      .query()
      .findById(manualJournalId)
      .throwIfNotFound();

    // Authorize manual journal editing.
    await this.authorize(manualJournalId, manualJournalDTO);

    // Transform manual journal DTO to model.
    const manualJournalObj = this.transformEditDTOToModel(
      manualJournalDTO,
      oldManualJournal,
    );
    // Edits the manual journal transactions with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalEditing` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onEditing, {
        manualJournalDTO,
        oldManualJournal,
        trx,
      } as IManualJournalEditingPayload);

      // Upserts the manual journal graph to the storage.
      await this.manualJournalModel()
        .query(trx)
        .upsertGraph({
          ...manualJournalObj,
        });
      // Retrieve the given manual journal with associated entries after modifications.
      const manualJournal = await this.manualJournalModel()
        .query(trx)
        .findById(manualJournalId)
        .withGraphFetched('entries');

      // Triggers `onManualJournalEdited` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onEdited, {
        manualJournal,
        oldManualJournal,
        manualJournalDTO,
        trx,
      } as IManualJournalEventEditedPayload);

      return { manualJournal, oldManualJournal };
    });
  }
}
