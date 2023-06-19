import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { omit, sumBy } from 'lodash';
import moment from 'moment';
import {
  IManualJournalDTO,
  ISystemUser,
  IManualJournal,
  IManualJournalEventEditedPayload,
  IManualJournalEditingPayload,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { CommandManualJournalValidators } from './CommandManualJournalValidators';

@Service()
export class EditManualJournal {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandManualJournalValidators;

  /**
   * Authorize the manual journal editing.
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @param {IManualJournalDTO} manualJournalDTO
   */
  private authorize = async (
    tenantId: number,
    manualJournalId: number,
    manualJournalDTO: IManualJournalDTO
  ) => {
    // Validates the total credit and debit to be equals.
    this.validator.valdiateCreditDebitTotalEquals(manualJournalDTO);

    // Validate the contacts existance.
    await this.validator.validateContactsExistance(tenantId, manualJournalDTO);

    // Validates entries accounts existance.
    await this.validator.validateAccountsExistance(tenantId, manualJournalDTO);

    // Validates the manual journal number uniquiness.
    if (manualJournalDTO.journalNumber) {
      await this.validator.validateManualJournalNoUnique(
        tenantId,
        manualJournalDTO.journalNumber,
        manualJournalId
      );
    }
    // Validate accounts with contact type from the given config.
    await this.validator.dynamicValidateAccountsWithContactType(
      tenantId,
      manualJournalDTO.entries
    );
  };

  /**
   * Transform the edit manual journal DTO to upsert graph operation.
   * @param {IManualJournalDTO} manualJournalDTO - Manual jorunal DTO.
   * @param {IManualJournal} oldManualJournal
   */
  private transformEditDTOToModel = (
    manualJournalDTO: IManualJournalDTO,
    oldManualJournal: IManualJournal
  ) => {
    const amount = sumBy(manualJournalDTO.entries, 'credit') || 0;
    const date = moment(manualJournalDTO.date).format('YYYY-MM-DD');

    return {
      id: oldManualJournal.id,
      ...omit(manualJournalDTO, ['publish']),
      ...(manualJournalDTO.publish && !oldManualJournal.publishedAt
        ? { publishedAt: moment().toMySqlDateTime() }
        : {}),
      amount,
      date,
    };
  };

  /**
   * Edits jouranl entries.
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @param {IMakeJournalDTO} manualJournalDTO
   * @param {ISystemUser} authorizedUser
   */
  public async editJournalEntries(
    tenantId: number,
    manualJournalId: number,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser
  ): Promise<{
    manualJournal: IManualJournal;
    oldManualJournal: IManualJournal;
  }> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Validates the manual journal existance on the storage.
    const oldManualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .throwIfNotFound();

    // Authorize manual journal editing.
    await this.authorize(tenantId, manualJournalId, manualJournalDTO);

    // Transform manual journal DTO to model.
    const manualJournalObj = this.transformEditDTOToModel(
      manualJournalDTO,
      oldManualJournal
    );
    // Edits the manual journal transactions with associated transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalEditing` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onEditing, {
        tenantId,
        manualJournalDTO,
        oldManualJournal,
        trx,
      } as IManualJournalEditingPayload);

      // Upserts the manual journal graph to the storage.
      await ManualJournal.query(trx).upsertGraph({
        ...manualJournalObj,
      });
      // Retrieve the given manual journal with associated entries after modifications.
      const manualJournal = await ManualJournal.query(trx)
        .findById(manualJournalId)
        .withGraphFetched('entries');

      // Triggers `onManualJournalEdited` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onEdited, {
        tenantId,
        manualJournal,
        oldManualJournal,
        trx,
      } as IManualJournalEventEditedPayload);

      return { manualJournal, oldManualJournal };
    });
  }
}
