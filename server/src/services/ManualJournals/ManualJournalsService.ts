import { difference, sumBy, omit, groupBy } from 'lodash';
import { Service, Inject } from 'typedi';
import moment from 'moment';
import { ServiceError } from 'exceptions';
import {
  IManualJournalDTO,
  IManualJournalsService,
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
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
  CONTACTS_NOT_FOUND: 'contacts_not_found',
};

const CONTACTS_CONFIG = [
  { accountBySlug: 'accounts-receivable', contactService: 'customer', assignRequired: false, },
  { accountBySlug: 'accounts-payable', contactService: 'vendor', assignRequired: true },
];

@Service()
export default class ManualJournalsService implements IManualJournalsService {
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
  private async validateManualJournalExistance(
    tenantId: number,
    manualJournalId: number
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    this.logger.info('[manual_journal] trying to validate existance.', {
      tenantId,
      manualJournalId,
    });
    const manualJournal = await ManualJournal.query().findById(manualJournalId);

    if (!manualJournal) {
      this.logger.warn('[manual_journal] not exists on the storage.', {
        tenantId,
        manualJournalId,
      });
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
  }

  /**
   * Validate manual journals existance.
   * @param  {number} tenantId
   * @param  {number[]} manualJournalsIds
   * @throws {ServiceError}
   */
  private async validateManualJournalsExistance(
    tenantId: number,
    manualJournalsIds: number[]
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query().whereIn(
      'id',
      manualJournalsIds
    );

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
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
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
    contactRequired: boolean = true,
  ): Promise<void> {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const payableAccount = await accountRepository.getBySlug(accountBySlug);
    const entriesHasNoVendorContact = manualJournalDTO.entries.filter(
      (e) =>
        e.accountId === payableAccount.id &&
        ((!e.contactId && contactRequired) || e.contactType !== contactType)
    );
    if (entriesHasNoVendorContact.length > 0) {
      const indexes = entriesHasNoVendorContact.map(e => e.index);

      throw new ServiceError(ERRORS.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT, '', {
        contactType,
        accountBySlug,
        indexes
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
    manualJournalDTO: IManualJournalDTO,
  ): Promise<any>{
    return Promise.all(
      CONTACTS_CONFIG.map(({ accountBySlug, contactService, assignRequired }) =>
        this.validateAccountsWithContactType(
          tenantId,
          manualJournalDTO,
          accountBySlug,
          contactService,
          assignRequired
        ),
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
    manualJournalDTO: IManualJournalDTO,
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    // Filters the entries that have contact only.
    const entriesContactPairs = manualJournalDTO.entries
      .filter((entry) => entry.contactId);

    if (entriesContactPairs.length > 0) {
      const entriesContactsIds = entriesContactPairs.map(entry => entry.contactId);

      // Retrieve all stored contacts on the storage from contacts entries.
      const storedContacts = await contactRepository.findByIds(
        entriesContactsIds,
      );
      // Converts the stored contacts to map with id as key and entry as value.
      const storedContactsMap = new Map(storedContacts.map(contact => [contact.id, contact]));
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
   * Transform manual journal DTO to graphed model to save it.
   * @param {IManualJournalDTO} manualJournalDTO
   * @param {ISystemUser} authorizedUser
   */
  private transformDTOToModel(
    manualJournalDTO: IManualJournalDTO,
    user: ISystemUser
  ): IManualJournal {
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
    }));
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
    await this.dynamicValidateAccountsWithContactType(tenantId, manualJournalDTO);

    this.logger.info(
      '[manual_journal] trying to save manual journal to the storage.',
      { tenantId, manualJournalDTO }
    );
    const manualJournalObj = this.transformDTOToModel(
      manualJournalDTO,
      authorizedUser
    );
    const manualJournal = await ManualJournal.query().insertAndFetch({
      ...omit(manualJournalObj, ['entries']),
    });
    // Triggers `onManualJournalCreated` event.
    this.eventDispatcher.dispatch(events.manualJournals.onCreated, {
      tenantId,
      manualJournal: { ...manualJournal, entries: manualJournalObj.entries },
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
  ): Promise<{ manualJournal: IManualJournal }> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Validates the manual journal existance on the storage.
    await this.validateManualJournalExistance(tenantId, manualJournalId);

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
    await this.dynamicValidateAccountsWithContactType(tenantId, manualJournalDTO);

    const manualJournalObj = this.transformDTOToModel(
      manualJournalDTO,
      authorizedUser
    );

    const storedManualJournal = await ManualJournal.query()
      .where('id', manualJournalId)
      .patch({
        ...omit(manualJournalObj, ['entries']),
      });
    const manualJournal: IManualJournal = {
      ...manualJournalObj,
      id: manualJournalId,
    };

    // Triggers `onManualJournalEdited` event.
    this.eventDispatcher.dispatch(events.manualJournals.onEdited, {
      tenantId,
      manualJournal,
    });
    return { manualJournal };
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
  ): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.logger.info('[manual_journal] trying to delete the manual journal.', {
      tenantId,
      manualJournalId,
    });
    await ManualJournal.query().findById(manualJournalId).delete();

    // Triggers `onManualJournalDeleted` event.
    this.eventDispatcher.dispatch(events.manualJournals.onDeleted, {
      tenantId,
      manualJournalId,
    });
    this.logger.info(
      '[manual_journal] the given manual journal deleted successfully.',
      { tenantId, manualJournalId }
    );
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
  ): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalsExistance(tenantId, manualJournalsIds);

    this.logger.info('[manual_journal] trying to delete the manual journals.', {
      tenantId,
      manualJournalsIds,
    });
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
  }

  /**
   * Publish the given manual journals.
   * @param {number} tenantId
   * @param {number[]} manualJournalsIds
   */
  public async publishManualJournals(
    tenantId: number,
    manualJournalsIds: number[]
  ): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalsExistance(tenantId, manualJournalsIds);

    this.logger.info('[manual_journal] trying to publish the manual journal.', {
      tenantId,
      manualJournalsIds,
    });
    await ManualJournal.query()
      .whereIn('id', manualJournalsIds)
      .patch({ status: 1 });

    // Triggers `onManualJournalPublishedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onPublishedBulk, {
      tenantId,
      manualJournalsIds,
    });
    this.logger.info(
      '[manual_journal] the given manula journal published successfully.',
      { tenantId, manualJournalId }
    );
  }

  /**
   * Publish the given manual journal.
   * @param {number} tenantId
   * @param {number} manualJournalId
   */
  public async publishManualJournal(
    tenantId: number,
    manualJournalId: number
  ): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);
    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.logger.info('[manual_journal] trying to publish the manual journal.', {
      tenantId,
      manualJournalId,
    });
    await ManualJournal.query().findById(manualJournalId).patch({ status: 1 });

    // Triggers `onManualJournalPublishedBulk` event.
    this.eventDispatcher.dispatch(events.manualJournals.onPublished, {
      tenantId,
      manualJournalId,
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

    await this.validateManualJournalExistance(tenantId, manualJournalId);

    this.logger.info(
      '[manual_journals] trying to get specific manual journal.',
      { tenantId, manualJournalId }
    );
    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries')
      .withGraphFetched('media');

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
    manualJournalObj?: IManualJournal | null,
    override?: Boolean
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    if (override) {
      this.logger.info('[manual_journal] trying to revert journal entries.', {
        tenantId,
        manualJournalId,
      });
      await journalCommands.revertJournalEntries(manualJournalId, 'Journal');
    }
    if (manualJournalObj) {
      journalCommands.manualJournal(manualJournalObj, manualJournalId);
    }
    this.logger.info('[manual_journal] trying to save journal entries.', {
      tenantId,
      manualJournalId,
    });
    await Promise.all([
      journal.saveBalance(),
      journal.deleteEntries(),
      journal.saveEntries(),
    ]);
    this.logger.info(
      '[manual_journal] the journal entries saved successfully.',
      { tenantId, manualJournalId }
    );
  }
}
