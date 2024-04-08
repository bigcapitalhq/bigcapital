import {
  IManualJournal,
  IManualJournalCreatingPayload,
  IManualJournalDTO,
  IManualJournalEventCreatedPayload,
  ISystemUser,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { ManualJournalBranchesDTOTransformer } from '@/services/Branches/Integrations/ManualJournals/ManualJournalDTOTransformer';
import TenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { TenantMetadata } from '@/system/models';
import { Knex } from 'knex';
import { omit, sumBy } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { AutoIncrementManualJournal } from './AutoIncrementManualJournal';
import { CommandManualJournalValidators } from './CommandManualJournalValidators';
@Service()
export class CreateManualJournalService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandManualJournalValidators;

  @Inject()
  private autoIncrement: AutoIncrementManualJournal;

  @Inject()
  private branchesDTOTransformer: ManualJournalBranchesDTOTransformer;

  /**
   * Transform the new manual journal DTO to upsert graph operation.
   * @param {IManualJournalDTO} manualJournalDTO - Manual jorunal DTO.
   * @param {ISystemUser} authorizedUser
   */
  private transformNewDTOToModel(
    tenantId,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser,
    baseCurrency: string,
  ) {
    const amount = sumBy(manualJournalDTO.entries, 'credit') || 0;
    const date = moment(manualJournalDTO.date).format('YYYY-MM-DD');

    // Retrieve the next manual journal number.
    const autoNextNumber = this.autoIncrement.getNextJournalNumber(tenantId);

    // The manual or auto-increment journal number.
    const journalNumber = manualJournalDTO.journalNumber || autoNextNumber;

    const initialDTO = {
      ...omit(manualJournalDTO, ['publish']),
      ...(manualJournalDTO.publish ? { publishedAt: moment().toMySqlDateTime() } : {}),
      amount,
      currencyCode: manualJournalDTO.currencyCode || baseCurrency,
      exchangeRate: manualJournalDTO.exchangeRate || 1,
      date,
      journalNumber,
      userId: authorizedUser.id,
    };
    return R.compose(
      // Omits the `branchId` from entries if multiply branches feature not active.
      this.branchesDTOTransformer.transformDTO(tenantId)
    )(initialDTO);
  }

  /**
   * Authorize the manual journal creating.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   * @param {ISystemUser} authorizedUser
   */
  private authorize = async (
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser,
    baseCurrency: string,
  ) => {
    // Validate the total credit should equals debit.
    this.validator.valdiateCreditDebitTotalEquals(manualJournalDTO);

    // Validate the contacts existance.
    await this.validator.validateContactsExistance(tenantId, manualJournalDTO);

    // Validate entries accounts existance.
    await this.validator.validateAccountsExistance(tenantId, manualJournalDTO);

    // Validate manual journal number require when auto-increment not enabled.
    this.validator.validateJournalNoRequireWhenAutoNotEnabled(tenantId, manualJournalDTO.journalNumber);
    // Validate manual journal uniquiness on the storage.
    if (manualJournalDTO.journalNumber) {
      await this.validator.validateManualJournalNoUnique(tenantId, manualJournalDTO.journalNumber);
    }
    // Validate accounts with contact type from the given config.
    await this.validator.dynamicValidateAccountsWithContactType(tenantId, manualJournalDTO.entries);
    // Validates the accounts currency with journal currency.
    await this.validator.validateJournalCurrencyWithAccountsCurrency(tenantId, manualJournalDTO, baseCurrency);
  };

  /**
   * Make journal entries.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   * @param {ISystemUser} authorizedUser
   */
  public makeJournalEntries = async (
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser,
    trx?: Knex.Transaction
  ): Promise<{ manualJournal: IManualJournal }> => {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Retrieves the tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Authorize manual journal creating.
    await this.authorize(tenantId, manualJournalDTO, authorizedUser, tenantMeta.baseCurrency);
    // Transformes the next DTO to model.
    const manualJournalObj = this.transformNewDTOToModel(
      tenantId,
      manualJournalDTO,
      authorizedUser,
      tenantMeta.baseCurrency,
    );
    // Creates a manual journal transactions with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onManualJournalCreating` event.
        await this.eventPublisher.emitAsync(events.manualJournals.onCreating, {
          tenantId,
          manualJournalDTO,
          trx,
        } as IManualJournalCreatingPayload);

        // Upsert the manual journal object.
        const manualJournal = await ManualJournal.query(trx).upsertGraph({
          ...manualJournalObj,
        });
        // Triggers `onManualJournalCreated` event.
        await this.eventPublisher.emitAsync(events.manualJournals.onCreated, {
          tenantId,
          manualJournal,
          manualJournalId: manualJournal.id,
          trx,
        } as IManualJournalEventCreatedPayload);

        return { manualJournal };
      },
      trx
    );
  };
}
