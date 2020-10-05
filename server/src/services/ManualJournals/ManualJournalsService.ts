import { difference, sumBy, omit } from 'lodash';
import { Service, Inject } from "typedi";
import moment from 'moment';
import { ServiceError } from "exceptions";
import {
  IManualJournalDTO,
  IManuaLJournalsService,
  IManualJournalsFilter,
  ISystemUser,
  IManualJournal,
  IManualJournalEntryDTO,
  IPaginationMeta,
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import events from 'subscribers/events';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalCommands from 'services/Accounting/JournalCommands';

const ERRORS = {
  NOT_FOUND: 'manual_journal_not_found',
  CREDIT_DEBIT_NOT_EQUAL_ZERO: 'credit_debit_not_equal_zero',
  CREDIT_DEBIT_NOT_EQUAL: 'credit_debit_not_equal',
  ACCCOUNTS_IDS_NOT_FOUND: 'acccounts_ids_not_found',
  JOURNAL_NUMBER_EXISTS: 'journal_number_exists',
  RECEIVABLE_ENTRIES_NO_CUSTOMERS: 'receivable_entries_have_no_customers',
  PAYABLE_ENTRIES_NO_VENDORS: 'payabel_entries_have_no_vendors',
  CONTACTS_NOT_FOUND: 'contacts_not_found',
};

@Service()
export default class ManualJournalsService implements IManuaLJournalsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Validates the manual journal existance.
   * @param {number} tenantId 
   * @param {number} manualJournalId 
   */
  private async validateManualJournalExistance(tenantId: number, manualJournalId: number) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    this.logger.info('[manual_journal] trying to validate existance.', { tenantId, manualJournalId });
    const manualJournal = await ManualJournal.query().findById(manualJournalId);

    if (!manualJournal) {
      this.logger.warn('[manual_journal] not exists on the storage.', { tenantId, manualJournalId });
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
  }

  /**
   * Validate manual journals existance.
   * @param  {number} tenantId 
   * @param  {number[]} manualJournalsIds
   * @throws {ServiceError} 
   */
  private async validateManualJournalsExistance(tenantId: number, manualJournalsIds: number[]) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query().whereIn('id', manualJournalsIds);

    const notFoundManualJournals = difference(
      manualJournalsIds,
      manualJournals.map((m) => m.id)
    );
    if (notFoundManualJournals.length > 0) {
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
  }

  /**
   * Validate manual journal credit and debit should be equal.
   * @param {IManualJournalDTO} manualJournalDTO 
   */
  private valdiateCreditDebitTotalEquals(manualJournalDTO: IManualJournalDTO) {
    let totalCredit = 0;
    let totalDebit = 0;

    manualJournalDTO.entries.forEach((entry) => {
      if (entry.credit > 0) {
        totalCredit += entry.credit;
      }
      if (entry.debit > 0) {
        totalDebit += entry.debit;
      }
    });
    if (totalCredit <= 0 || totalDebit <= 0) {
      this.logger.info('[manual_journal] the total credit and debit equals zero.');
      throw new ServiceError(ERRORS.CREDIT_DEBIT_NOT_EQUAL_ZERO);
    }
    if (totalCredit !== totalDebit) {
      this.logger.info('[manual_journal] the total credit not equals total debit.');
      throw new ServiceError(ERRORS.CREDIT_DEBIT_NOT_EQUAL);
    }
  }

  /**
   * Validate manual entries accounts existance on the storage.
   * @param {number} tenantId 
   * @param {IManualJournalDTO} manualJournalDTO 
   */
  private async validateAccountsExistance(tenantId: number, manualJournalDTO: IManualJournalDTO) {
    const { Account } = this.tenancy.models(tenantId);
    const manualAccountsIds = manualJournalDTO.entries.map(e => e.accountId);

    const accounts = await Account.query()
      .whereIn('id', manualAccountsIds)
      .withGraphFetched('type');

    const storedAccountsIds = accounts.map((account) => account.id);

    if (difference(manualAccountsIds, storedAccountsIds).length > 0) {
      this.logger.info('[manual_journal] some entries accounts not exist.', { tenantId, manualAccountsIds });
      throw new ServiceError(ERRORS.ACCCOUNTS_IDS_NOT_FOUND);
    }
  }

  /**
   * Validate manual journal number unique.
   * @param {number} tenantId 
   * @param {IManualJournalDTO} manualJournalDTO 
   */
  private async validateManualJournalNoUnique(tenantId: number, manualJournalDTO: IManualJournalDTO, notId?: numebr) {
    const { ManualJournal } = this.tenancy.models(tenantId);
    const journalNumber = await ManualJournal.query().where(
      'journal_number',
      manualJournalDTO.journalNumber,
    ).onBuild((builder) => {
      if (notId) {
        builder.whereNot('id', notId);
      }
    });
    if (journalNumber.length > 0) {
      throw new ServiceError(ERRORS.JOURNAL_NUMBER_EXISTS);
    }
  }

  /**
   * Validate entries that have receivable account should have customer type.
   * @param {number} tenantId - 
   * @param {IManualJournalDTO} manualJournalDTO 
   */
  private async validateReceivableEntries(tenantId: number, manualJournalDTO: IManualJournalDTO): Promise<void> {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const receivableAccount = await accountRepository.getBySlug('accounts-receivable');

    const entriesHasNoReceivableAccount = manualJournalDTO.entries.filter(
      (e) => (e.accountId === receivableAccount.id) &&
             (!e.contactId || e.contactType !== 'customer')
    );
    if (entriesHasNoReceivableAccount.length > 0) {
      throw new ServiceError(ERRORS.RECEIVABLE_ENTRIES_NO_CUSTOMERS);
    }
  }

  /**
   * Validates payable entries should have vendor type.
   * @param {number} tenantId - 
   * @param {IManualJournalDTO} manualJournalDTO 
   */
  private async validatePayableEntries(tenantId: number, manualJournalDTO: IManualJournalDTO): Promise<void> {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const payableAccount = await accountRepository.getBySlug('accounts-payable');

    const entriesHasNoVendorContact = manualJournalDTO.entries.filter(
      (e) => (e.accountId === payableAccount.id) &&
             (!e.contactId || e.contactType !== 'vendor')
    );
    if (entriesHasNoVendorContact.length > 0) {
      throw new ServiceError(ERRORS.PAYABLE_ENTRIES_NO_VENDORS);
    }
  }

  /**
   * Vaplidate entries contacts existance. 
   * @param {number} tenantId - 
   * @param {IManualJournalDTO} manualJournalDTO 
   */
  private async validateContactsExistance(tenantId: number, manualJournalDTO: IManualJournalDTO) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const manualJCotactsIds = manualJournalDTO.entries
      .filter((entry) => entry.contactId)
      .map((entry) => entry.contactId);

    if (manualJCotactsIds.length > 0) {
      const storedContacts = await contactRepository.findByIds(manualJCotactsIds);
      const storedContactsIds = storedContacts.map((c) => c.id);

      const notFoundContactsIds = difference(manualJCotactsIds, storedContactsIds);

      if (notFoundContactsIds.length > 0) {
        throw new ServiceError(ERRORS.CONTACTS_NOT_FOUND);
      }
    }
  }

  /**
   * Transform manual journal DTO to graphed model to save it.
   * @param {IManualJournalDTO} manualJournalDTO 
   * @param {ISystemUser} authorizedUser
   */
  private transformDTOToModel(manualJournalDTO: IManualJournalDTO, user: ISystemUser): IManualJournal {
    const amount = sumBy(manualJournalDTO.entries, 'credit') || 0;
    const date = moment(manualJournalDTO.date).format('YYYY-MM-DD');

    return {
      ...manualJournalDTO,
      amount,
      date,
      userId: user.id,
      entries: this.transformDTOToEntriesModel(manualJournalDTO.entries),
    };
  }

  /**
   * Transform DTO to model.
   * @param {IManualJournalEntryDTO[]} entries 
   */
  private transformDTOToEntriesModel(entries: IManualJournalEntryDTO[]) {
    return entries.map((entry: IManualJournalEntryDTO) => ({
      ...omit(entry, ['accountId']),
      account: entry.accountId,
    }))
  }

  /**
   * Make journal entries.
   * @param {number} tenantId 
   * @param {IManualJournalDTO} manualJournalDTO 
   * @param {ISystemUser} authorizedUser 
   */
  public async makeJournalEntries(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser
  ): Promise<{ manualJournal: IManualJournal }> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    this.valdiateCreditDebitTotalEquals(manualJournalDTO);

    await this.validateReceivableEntries(tenantId, manualJournalDTO);
    await this.validatePayableEntries(tenantId, manualJournalDTO);
    await this.validateContactsExistance(tenantId, manualJournalDTO);

    await this.validateAccountsExistance(tenantId, manualJournalDTO);
    await this.validateManualJournalNoUnique(tenantId, manualJournalDTO);

    this.logger.info('[manual_journal] trying to save manual journal to the storage.', { tenantId, manualJournalDTO });
    const manualJournalObj = this.transformDTOToModel(manualJournalDTO, authorizedUser);

    const storedManualJournal = await ManualJournal.query().insert({
      ...omit(manualJournalObj, ['entries']),
    });
    const manualJournal: IManualJournal = { ...manualJournalObj, id: storedManualJournal.id };

    // Triggers `onManualJournalCreated` event.
    this.eventDispatcher.dispatch(events.manualJournals.onCreated, {
      tenantId, manualJournal,
    });
    this.logger.info('[manual_journal] the manual journal inserted successfully.', { tenantId });

    return { manualJournal };
  }

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
  ): Promise<{ manualJournal: IManualJournal }> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.valdiateCreditDebitTotalEquals(manualJournalDTO);

    await this.validateAccountsExistance(tenantId, manualJournalDTO);
    await this.validateManualJournalNoUnique(tenantId, manualJournalDTO, manualJournalId);

    const manualJournalObj = this.transformDTOToModel(manualJournalDTO, authorizedUser);

    const storedManualJournal = await ManualJournal.query().where('id', manualJournalId)
      .patch({
        ...omit(manualJournalObj, ['entries']),
      });
    const manualJournal: IManualJournal = { ...manualJournalObj, id: manualJournalId };

    // Triggers `onManualJournalEdited` event.
    this.eventDispatcher.dispatch(events.manualJournals.onEdited, {
      tenantId, manualJournal,
    });
    return { manualJournal };
  }

  /**
   * Deletes the given manual journal
   * @param {number} tenantId 
   * @param {number} manualJournalId 
   * @return {Promise<void>}
   */
  public async deleteManualJournal(tenantId: number, manualJournalId: number): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.logger.info('[manual_journal] trying to delete the manual journal.', { tenantId, manualJournalId });
    await ManualJournal.query().findById(manualJournalId).delete();

    // Triggers `onManualJournalDeleted` event.
    this.eventDispatcher.dispatch(events.manualJournals.onDeleted, {
      tenantId, manualJournalId,
    });
    this.logger.info('[manual_journal] the given manual journal deleted successfully.', { tenantId, manualJournalId });
  }
 
  /**
   * Deletes the given manual journals.
   * @param {number} tenantId 
   * @param {number[]} manualJournalsIds 
   * @return {Promise<void>}
   */
  public async deleteManualJournals(tenantId: number, manualJournalsIds: number[]): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalsExistance(tenantId, manualJournalsIds);

    this.logger.info('[manual_journal] trying to delete the manual journals.', { tenantId, manualJournalsIds });
    await ManualJournal.query().where('id', manualJournalsIds).delete();

    // Triggers `onManualJournalDeletedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onDeletedBulk, {
      tenantId, manualJournalsIds,
    });
    this.logger.info('[manual_journal] the given manual journals deleted successfully.', { tenantId, manualJournalsIds });
  }

  /**
   * Publish the given manual journals.
   * @param {number} tenantId 
   * @param {number[]} manualJournalsIds 
   */
  public async publishManualJournals(tenantId: number, manualJournalsIds: number[]): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalsExistance(tenantId, manualJournalsIds);

    this.logger.info('[manual_journal] trying to publish the manual journal.', { tenantId, manualJournalsIds });
    await ManualJournal.query().whereIn('id', manualJournalsIds).patch({ status: 1, });

    // Triggers `onManualJournalPublishedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onPublishedBulk, {
      tenantId, manualJournalsIds,
    });
    this.logger.info('[manual_journal] the given manula journal published successfully.', { tenantId, manualJournalId });
  }

  /**
   * Publish the given manual journal.
   * @param {number} tenantId 
   * @param {number} manualJournalId 
   */
  public async publishManualJournal(tenantId: number, manualJournalId: number): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.logger.info('[manual_journal] trying to publish the manual journal.', { tenantId, manualJournalId });
    await ManualJournal.query().findById(manualJournalId).patch({ status: 1, });

    // Triggers `onManualJournalPublishedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onPublished, {
      tenantId, manualJournalId,
    });
    this.logger.info('[manual_journal] the given manula journal published successfully.', { tenantId, manualJournalId });
  }

  /**
   * Retrieve manual journals datatable list.
   * @param {number} tenantId 
   * @param {IManualJournalsFilter} filter 
   */
  public async getManualJournals(
    tenantId: number,
    filter: IManualJournalsFilter
  ): Promise<{ manualJournals: IManualJournal, pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, ManualJournal, filter);

    this.logger.info('[manual_journals] trying to get manual journals list.', { tenantId, filter });
    const { results, pagination } = await ManualJournal.query().onBuild((builder) => {
      dynamicList.buildQuery()(builder);
    }).pagination(filter.page - 1, filter.pageSize);

    return {
      manualJournals: results,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }
 
  /**
   * Retrieve manual journal details with assocaited journal transactions.
   * @param {number} tenantId 
   * @param {number} manualJournalId 
   */
  public async getManualJournal(tenantId: number, manualJournalId: number) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.logger.info('[manual_journals] trying to get specific manual journal.', { tenantId, manualJournalId });
    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries');

    return manualJournal;
  }

  /**
   * Write manual journal entries.
   * @param {number} tenantId 
   * @param {number} manualJournalId 
   * @param {IManualJournal|null} manualJournalObj 
   * @param {boolean} override 
   */
  public async writeJournalEntries(
    tenantId: number,
    manualJournalId: number,
    manualJournalObj?: IManualJournal|null,
    override?: Boolean,
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    if (override) {
      this.logger.info('[manual_journal] trying to revert journal entries.', { tenantId, manualJournalId });
      await journalCommands.revertJournalEntries(manualJournalId, 'Journal');
    }
    if (manualJournalObj) {
      journalCommands.manualJournal(manualJournalObj, manualJournalId);
    }
    this.logger.info('[manual_journal] trying to save journal entries.', { tenantId, manualJournalId });
    await Promise.all([
      journal.saveBalance(),
      journal.deleteEntries(),
      journal.saveEntries(),
    ]);
    this.logger.info('[manual_journal] the journal entries saved successfully.', { tenantId, manualJournalId });
  }
}