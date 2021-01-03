import { difference, sumBy, omit, map } from 'lodash';
import { Service, Inject } from 'typedi';
import moment from 'moment';
import { ServiceError } from 'exceptions';
import {
  IManualJournalDTO,
  IManualJournalsService,
  IManualJournalsFilter,
  ISystemUser,
  IManualJournal,
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
import JournalPosterService from 'services/Sales/JournalPosterService';

const ERRORS = {
  NOT_FOUND: 'manual_journal_not_found',
  CREDIT_DEBIT_NOT_EQUAL_ZERO: 'credit_debit_not_equal_zero',
  CREDIT_DEBIT_NOT_EQUAL: 'credit_debit_not_equal',
  ACCCOUNTS_IDS_NOT_FOUND: 'acccounts_ids_not_found',
  JOURNAL_NUMBER_EXISTS: 'journal_number_exists',
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
  CONTACTS_NOT_FOUND: 'contacts_not_found',
  MANUAL_JOURNAL_ALREADY_PUBLISHED: 'MANUAL_JOURNAL_ALREADY_PUBLISHED',
};

const CONTACTS_CONFIG = [
  {
    accountBySlug: 'accounts-receivable',
    contactService: 'customer',
    assignRequired: false,
  },
  {
    accountBySlug: 'accounts-payable',
    contactService: 'vendor',
    assignRequired: true,
  },
];

@Service()
export default class ManualJournalsService implements IManualJournalsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  journalService: JournalPosterService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Validates the manual journal existance.
   * @param {number} tenantId
   * @param {number} manualJournalId
   */
  private async getManualJournalOrThrowError(
    tenantId: number,
    manualJournalId: number
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    this.logger.info('[manual_journal] trying to validate existance.', {
      tenantId,
      manualJournalId,
    });
    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries');

    if (!manualJournal) {
      this.logger.warn('[manual_journal] not exists on the storage.', {
        tenantId,
        manualJournalId,
      });
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
    return manualJournal;
  }

  /**
   * Validate manual journals existance.
   * @param {number} tenantId - Tenant id.
   * @param {number[]} manualJournalsIds - Manual jorunal ids.
   * @throws {ServiceError}
   */
  private async getManualJournalsOrThrowError(
    tenantId: number,
    manualJournalsIds: number[]
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query()
      .whereIn('id', manualJournalsIds)
      .withGraphFetched('entries');

    const notFoundManualJournals = difference(
      manualJournalsIds,
      manualJournals.map((m) => m.id)
    );
    if (notFoundManualJournals.length > 0) {
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
    return manualJournals;
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
      this.logger.info(
        '[manual_journal] the total credit and debit equals zero.'
      );
      throw new ServiceError(ERRORS.CREDIT_DEBIT_NOT_EQUAL_ZERO);
    }
    if (totalCredit !== totalDebit) {
      this.logger.info(
        '[manual_journal] the total credit not equals total debit.'
      );
      throw new ServiceError(ERRORS.CREDIT_DEBIT_NOT_EQUAL);
    }
  }

  /**
   * Validate manual entries accounts existance on the storage.
   * @param {number} tenantId -
   * @param {IManualJournalDTO} manualJournalDTO -
   */
  private async validateAccountsExistance(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO
  ) {
    const { Account } = this.tenancy.models(tenantId);
    const manualAccountsIds = manualJournalDTO.entries.map((e) => e.accountId);

    const accounts = await Account.query()
      .whereIn('id', manualAccountsIds)
      .withGraphFetched('type');

    const storedAccountsIds = accounts.map((account) => account.id);

    if (difference(manualAccountsIds, storedAccountsIds).length > 0) {
      this.logger.info('[manual_journal] some entries accounts not exist.', {
        tenantId,
        manualAccountsIds,
      });
      throw new ServiceError(ERRORS.ACCCOUNTS_IDS_NOT_FOUND);
    }
  }

  /**
   * Validate manual journal number unique.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   */
  private async validateManualJournalNoUnique(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    notId?: number
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);
    const journalNumber = await ManualJournal.query()
      .where('journal_number', manualJournalDTO.journalNumber)
      .onBuild((builder) => {
        if (notId) {
          builder.whereNot('id', notId);
        }
      });
    if (journalNumber.length > 0) {
      throw new ServiceError(ERRORS.JOURNAL_NUMBER_EXISTS);
    }
  }

  /**
   *
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   * @param {string} accountBySlug
   * @param {string} contactType
   */
  private async validateAccountsWithContactType(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    accountBySlug: string,
    contactType: string,
    contactRequired: boolean = true
  ): Promise<void> {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const payableAccount = await accountRepository.findOne({
      slug: accountBySlug,
    });

    const entriesHasNoVendorContact = manualJournalDTO.entries.filter(
      (e) =>
        e.accountId === payableAccount.id &&
        ((!e.contactId && contactRequired) || e.contactType !== contactType)
    );
    if (entriesHasNoVendorContact.length > 0) {
      const indexes = entriesHasNoVendorContact.map((e) => e.index);

      throw new ServiceError(ERRORS.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT, '', {
        contactType,
        accountBySlug,
        indexes,
      });
    }
  }

  /**
   * Dynamic validates accounts with contacts.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   */
  private async dynamicValidateAccountsWithContactType(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO
  ): Promise<any> {
    return Promise.all(
      CONTACTS_CONFIG.map(({ accountBySlug, contactService, assignRequired }) =>
        this.validateAccountsWithContactType(
          tenantId,
          manualJournalDTO,
          accountBySlug,
          contactService,
          assignRequired
        )
      )
    );
  }

  /**
   * Vaplidate entries contacts existance.
   * @param {number} tenantId -
   * @param {IManualJournalDTO} manualJournalDTO
   */
  private async validateContactsExistance(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    // Filters the entries that have contact only.
    const entriesContactPairs = manualJournalDTO.entries.filter(
      (entry) => entry.contactId
    );

    if (entriesContactPairs.length > 0) {
      const entriesContactsIds = entriesContactPairs.map(
        (entry) => entry.contactId
      );

      // Retrieve all stored contacts on the storage from contacts entries.
      const storedContacts = await contactRepository.findByIds(
        entriesContactsIds
      );
      // Converts the stored contacts to map with id as key and entry as value.
      const storedContactsMap = new Map(
        storedContacts.map((contact) => [contact.id, contact])
      );
      const notFoundContactsIds = [];

      entriesContactPairs.forEach((contactEntry) => {
        const storedContact = storedContactsMap.get(contactEntry.contactId);

        // in case the contact id not found or contact type no equals pushed to
        // not found contacts.
        if (
          !storedContact ||
          storedContact.contactService !== contactEntry.contactType
        ) {
          notFoundContactsIds.push(storedContact);
        }
      });
      if (notFoundContactsIds.length > 0) {
        throw new ServiceError(ERRORS.CONTACTS_NOT_FOUND, '', {
          contactsIds: notFoundContactsIds,
        });
      }
    }
  }

  /**
   * Transform the new manual journal DTO to upsert graph operation.
   * @param {IManualJournalDTO} manualJournalDTO - Manual jorunal DTO.
   * @param {ISystemUser} authorizedUser
   */
  private transformNewDTOToModel(
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser
  ) {
    const amount = sumBy(manualJournalDTO.entries, 'credit') || 0;
    const date = moment(manualJournalDTO.date).format('YYYY-MM-DD');

    return {
      ...omit(manualJournalDTO, ['publish']),
      ...(manualJournalDTO.publish
        ? { publishedAt: moment().toMySqlDateTime() }
        : {}),
      amount,
      date,
      userId: authorizedUser.id,
    };
  }

  /**
   * Transform the edit manual journal DTO to upsert graph operation.
   * @param {IManualJournalDTO} manualJournalDTO - Manual jorunal DTO.
   * @param {IManualJournal} oldManualJournal
   */
  private transformEditDTOToModel(
    manualJournalDTO: IManualJournalDTO,
    oldManualJournal: IManualJournal
  ) {
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

    // Validate the total credit should equals debit.
    this.valdiateCreditDebitTotalEquals(manualJournalDTO);

    // Validate the contacts existance.
    await this.validateContactsExistance(tenantId, manualJournalDTO);

    // Validate entries accounts existance.
    await this.validateAccountsExistance(tenantId, manualJournalDTO);

    // Validate manual journal uniquiness on the storage.
    await this.validateManualJournalNoUnique(tenantId, manualJournalDTO);

    // Validate accounts with contact type from the given config.
    await this.dynamicValidateAccountsWithContactType(
      tenantId,
      manualJournalDTO
    );
    this.logger.info(
      '[manual_journal] trying to save manual journal to the storage.',
      { tenantId, manualJournalDTO }
    );
    const manualJournalObj = this.transformNewDTOToModel(
      manualJournalDTO,
      authorizedUser
    );
    const manualJournal = await ManualJournal.query().upsertGraph({
      ...manualJournalObj,
    });
    // Triggers `onManualJournalCreated` event.
    this.eventDispatcher.dispatch(events.manualJournals.onCreated, {
      tenantId,
      manualJournal,
      manualJournalId: manualJournal.id,
    });
    this.logger.info(
      '[manual_journal] the manual journal inserted successfully.',
      { tenantId }
    );

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
  ): Promise<{
    manualJournal: IManualJournal;
    oldManualJournal: IManualJournal;
  }> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Validates the manual journal existance on the storage.
    const oldManualJournal = await this.getManualJournalOrThrowError(
      tenantId,
      manualJournalId
    );
    // Validates the total credit and debit to be equals.
    this.valdiateCreditDebitTotalEquals(manualJournalDTO);

    // Validate the contacts existance.
    await this.validateContactsExistance(tenantId, manualJournalDTO);

    // Validates entries accounts existance.
    await this.validateAccountsExistance(tenantId, manualJournalDTO);

    // Validates the manual journal number uniquiness.
    await this.validateManualJournalNoUnique(
      tenantId,
      manualJournalDTO,
      manualJournalId
    );
    // Validate accounts with contact type from the given config.
    await this.dynamicValidateAccountsWithContactType(
      tenantId,
      manualJournalDTO
    );
    // Transform manual journal DTO to model.
    const manualJournalObj = this.transformEditDTOToModel(
      manualJournalDTO,
      oldManualJournal
    );
    await ManualJournal.query().upsertGraph({
      ...manualJournalObj,
    });
    // Retrieve the given manual journal with associated entries after modifications.
    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries');

    // Triggers `onManualJournalEdited` event.
    this.eventDispatcher.dispatch(events.manualJournals.onEdited, {
      tenantId,
      manualJournal,
      oldManualJournal,
    });
    return { manualJournal, oldManualJournal };
  }

  /**
   * Deletes the given manual journal
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @return {Promise<void>}
   */
  public async deleteManualJournal(
    tenantId: number,
    manualJournalId: number
  ): Promise<{
    oldManualJournal: IManualJournal;
  }> {
    const { ManualJournal, ManualJournalEntry } = this.tenancy.models(tenantId);

    // Validate the manual journal exists on the storage.
    const oldManualJournal = await this.getManualJournalOrThrowError(
      tenantId,
      manualJournalId
    );
    this.logger.info('[manual_journal] trying to delete the manual journal.', {
      tenantId,
      manualJournalId,
    });
    // Deletes the manual journal entries.
    await ManualJournalEntry.query()
      .where('manual_journal_id', manualJournalId)
      .delete();

    // Deletes the manual journal transaction.
    await ManualJournal.query().findById(manualJournalId).delete();

    // Triggers `onManualJournalDeleted` event.
    this.eventDispatcher.dispatch(events.manualJournals.onDeleted, {
      tenantId,
      manualJournalId,
      oldManualJournal,
    });
    this.logger.info(
      '[manual_journal] the given manual journal deleted successfully.',
      { tenantId, manualJournalId }
    );

    return { oldManualJournal };
  }

  /**
   * Deletes the given manual journals.
   * @param {number} tenantId
   * @param {number[]} manualJournalsIds
   * @return {Promise<void>}
   */
  public async deleteManualJournals(
    tenantId: number,
    manualJournalsIds: number[]
  ): Promise<{
    oldManualJournals: IManualJournal[]
  }> {
    const { ManualJournal, ManualJournalEntry } = this.tenancy.models(tenantId);

    // Validate the manual journals exist on the storage.
    const oldManualJournals = await this.getManualJournalsOrThrowError(
      tenantId,
      manualJournalsIds
    );
    this.logger.info('[manual_journal] trying to delete the manual journals.', {
      tenantId,
      manualJournalsIds,
    });
    // Deletes the manual journal entries.
    await ManualJournalEntry.query()
      .whereIn('manual_journal_id', manualJournalsIds)
      .delete();

    // Deletes the manual journal transaction.
    await ManualJournal.query().whereIn('id', manualJournalsIds).delete();

    // Triggers `onManualJournalDeletedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onDeletedBulk, {
      tenantId,
      manualJournalsIds,
    });
    this.logger.info(
      '[manual_journal] the given manual journals deleted successfully.',
      { tenantId, manualJournalsIds }
    );
    return { oldManualJournals };
  }

  /**
   * Publish the given manual journals.
   * @param {number} tenantId
   * @param {number[]} manualJournalsIds
   */
  public async publishManualJournals(
    tenantId: number,
    manualJournalsIds: number[]
  ): Promise<{
    meta: {
      alreadyPublished: number;
      published: number;
      total: number;
    };
  }> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Retrieve manual journals or throw service error.
    const oldManualJournals = await this.getManualJournalsOrThrowError(
      tenantId,
      manualJournalsIds
    );
    // Filters the not published journals.
    const notPublishedJournals = this.getNonePublishedManualJournals(
      oldManualJournals
    );
    // Filters the published journals.
    const publishedJournals = this.getPublishedManualJournals(
      oldManualJournals
    );
    // Mappes the not-published journals to get id.
    const notPublishedJournalsIds = map(notPublishedJournals, 'id');

    this.logger.info('[manual_journal] trying to publish the manual journal.', {
      tenantId,
      manualJournalsIds,
    });

    if (notPublishedJournals.length > 0) {
      // Mark the given manual journals as published.
      await ManualJournal.query().whereIn('id', notPublishedJournalsIds).patch({
        publishedAt: moment().toMySqlDateTime(),
      });
    }
    // Triggers `onManualJournalPublishedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onPublishedBulk, {
      tenantId,
      manualJournalsIds,
      oldManualJournals,
    });
    this.logger.info(
      '[manual_journal] the given manula journal published successfully.',
      { tenantId, manualJournalsIds }
    );

    return {
      meta: {
        alreadyPublished: publishedJournals.length,
        published: notPublishedJournals.length,
        total: oldManualJournals.length,
      },
    };
  }

  /**
   * Validates expenses is not already published before.
   * @param {IManualJournal} manualJournal
   */
  private validateManualJournalIsNotPublished(manualJournal: IManualJournal) {
    if (manualJournal.publishedAt) {
      throw new ServiceError(ERRORS.MANUAL_JOURNAL_ALREADY_PUBLISHED);
    }
  }

  /**
   * Filters the not published manual jorunals.
   * @param {IManualJournal[]} manualJournal - Manual journal.
   * @return {IManualJournal[]}
   */
  public getNonePublishedManualJournals(
    manualJournals: IManualJournal[]
  ): IManualJournal[] {
    return manualJournals.filter((manualJournal) => !manualJournal.publishedAt);
  }

  /**
   * Filters the published manual journals.
   * @param {IManualJournal[]} manualJournal - Manual journal.
   * @return {IManualJournal[]}
   */
  public getPublishedManualJournals(
    manualJournals: IManualJournal[]
  ): IManualJournal[] {
    return manualJournals.filter((expense) => expense.publishedAt);
  }

  /**
   * Publish the given manual journal.
   * @param {number} tenantId - Tenant id.
   * @param {number} manualJournalId - Manual journal id.
   */
  public async publishManualJournal(
    tenantId: number,
    manualJournalId: number
  ): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const oldManualJournal = await this.getManualJournalOrThrowError(
      tenantId,
      manualJournalId
    );
    this.logger.info('[manual_journal] trying to publish the manual journal.', {
      tenantId,
      manualJournalId,
    });
    this.validateManualJournalIsNotPublished(oldManualJournal);

    // Mark the given manual journal as published.
    await ManualJournal.query().findById(manualJournalId).patch({
      publishedAt: moment().toMySqlDateTime(),
    });
    // Retrieve the manual journal with enrties after modification.
    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries');

    // Triggers `onManualJournalPublishedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onPublished, {
      tenantId,
      manualJournal,
      manualJournalId,
      oldManualJournal,
    });
    this.logger.info(
      '[manual_journal] the given manula journal published successfully.',
      { tenantId, manualJournalId }
    );
  }

  /**
   * Retrieve manual journals datatable list.
   * @param {number} tenantId
   * @param {IManualJournalsFilter} filter
   */
  public async getManualJournals(
    tenantId: number,
    filter: IManualJournalsFilter
  ): Promise<{
    manualJournals: IManualJournal;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      ManualJournal,
      filter
    );

    this.logger.info('[manual_journals] trying to get manual journals list.', {
      tenantId,
      filter,
    });
    const { results, pagination } = await ManualJournal.query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);
        builder.withGraphFetched('entries.account');
      })
      .pagination(filter.page - 1, filter.pageSize);

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

    await this.getManualJournalOrThrowError(tenantId, manualJournalId);

    this.logger.info(
      '[manual_journals] trying to get specific manual journal.',
      { tenantId, manualJournalId }
    );
    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries')
      .withGraphFetched('transactions')
      .withGraphFetched('media');

    return manualJournal;
  }

  /**
   * Reverts the manual journal journal entries.
   * @param {number} tenantId
   * @param {number|number[]} manualJournalId
   * @return {Promise<void>}
   */
  public async revertJournalEntries(
    tenantId: number,
    manualJournalId: number | number[]
  ): Promise<void> {
    this.logger.info('[manual_journal] trying to revert journal entries.', {
      tenantId,
      manualJournalId,
    });
    return this.journalService.revertJournalTransactions(
      tenantId,
      manualJournalId,
      'Journal'
    );
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
    manualJorunal: IManualJournal | IManualJournal[],
    override: Boolean = false
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    const manualJournals = Array.isArray(manualJorunal)
      ? manualJorunal
      : [manualJorunal];
    const manualJournalsIds = map(manualJournals, 'id');

    if (override) {
      this.logger.info('[manual_journal] trying to revert journal entries.', {
        tenantId,
        manualJorunal,
      });
      await journalCommands.revertJournalEntries(manualJournalsIds, 'Journal');
    }
    manualJournals.forEach((manualJournal) => {
      journalCommands.manualJournal(manualJournal);
    });
    this.logger.info('[manual_journal] trying to save journal entries.', {
      tenantId,
      manualJorunal,
    });
    await Promise.all([
      journal.saveBalance(),
      journal.deleteEntries(),
      journal.saveEntries(),
    ]);
    this.logger.info(
      '[manual_journal] the journal entries saved successfully.',
      { tenantId, manualJournalId: manualJorunal.id }
    );
  }
}
