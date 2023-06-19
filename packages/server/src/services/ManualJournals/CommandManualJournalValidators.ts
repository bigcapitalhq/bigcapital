import { difference } from 'lodash';
import { Service, Inject } from 'typedi';
import { ServiceError } from '@/exceptions';
import {
  IManualJournalDTO,
  IManualJournalEntry,
  IManualJournal,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { AutoIncrementManualJournal } from './AutoIncrementManualJournal';

@Service()
export class CommandManualJournalValidators {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private autoIncrement: AutoIncrementManualJournal;

  /**
   * Validate manual journal credit and debit should be equal.
   * @param {IManualJournalDTO} manualJournalDTO
   */
  public valdiateCreditDebitTotalEquals(manualJournalDTO: IManualJournalDTO) {
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
      throw new ServiceError(ERRORS.CREDIT_DEBIT_NOT_EQUAL_ZERO);
    }
    if (totalCredit !== totalDebit) {
      throw new ServiceError(ERRORS.CREDIT_DEBIT_NOT_EQUAL);
    }
  }

  /**
   * Validate manual entries accounts existance on the storage.
   * @param {number} tenantId -
   * @param {IManualJournalDTO} manualJournalDTO -
   */
  public async validateAccountsExistance(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO
  ) {
    const { Account } = this.tenancy.models(tenantId);
    const manualAccountsIds = manualJournalDTO.entries.map((e) => e.accountId);

    const accounts = await Account.query().whereIn('id', manualAccountsIds);

    const storedAccountsIds = accounts.map((account) => account.id);

    if (difference(manualAccountsIds, storedAccountsIds).length > 0) {
      throw new ServiceError(ERRORS.ACCOUNTS_IDS_NOT_FOUND);
    }
  }

  /**
   * Validate manual journal number unique.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   */
  public async validateManualJournalNoUnique(
    tenantId: number,
    journalNumber: string,
    notId?: number
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);
    const journals = await ManualJournal.query()
      .where('journal_number', journalNumber)
      .onBuild((builder) => {
        if (notId) {
          builder.whereNot('id', notId);
        }
      });
    if (journals.length > 0) {
      throw new ServiceError(ERRORS.JOURNAL_NUMBER_EXISTS);
    }
  }

  /**
   * Validate accounts with contact type.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   * @param {string} accountBySlug
   * @param {string} contactType
   */
  public async validateAccountWithContactType(
    tenantId: number,
    entriesDTO: IManualJournalEntry[],
    accountBySlug: string,
    contactType: string
  ): Promise<void | ServiceError> {
    const { Account } = this.tenancy.models(tenantId);
    const { contactRepository } = this.tenancy.repositories(tenantId);

    // Retrieve account meta by the given account slug.
    const account = await Account.query().findOne('slug', accountBySlug);

    // Retrieve all stored contacts on the storage from contacts entries.
    const storedContacts = await contactRepository.findWhereIn(
      'id',
      entriesDTO
        .filter((entry) => entry.contactId)
        .map((entry) => entry.contactId)
    );
    // Converts the stored contacts to map with id as key and entry as value.
    const storedContactsMap = new Map(
      storedContacts.map((contact) => [contact.id, contact])
    );

    // Filter all entries of the given account.
    const accountEntries = entriesDTO.filter(
      (entry) => entry.accountId === account.id
    );
    // Can't continue if there is no entry that associate to the given account.
    if (accountEntries.length === 0) {
      return;
    }
    // Filter entries that have no contact type or not equal the valid type.
    const entriesNoContact = accountEntries.filter((entry) => {
      const contact = storedContactsMap.get(entry.contactId);
      return !contact || contact.contactService !== contactType;
    });
    // Throw error in case one of entries that has invalid contact type.
    if (entriesNoContact.length > 0) {
      const indexes = entriesNoContact.map((e) => e.index);

      return new ServiceError(ERRORS.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT, '', {
        accountSlug: accountBySlug,
        contactType,
        indexes,
      });
    }
  }

  /**
   * Dynamic validates accounts with contacts.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   */
  public async dynamicValidateAccountsWithContactType(
    tenantId: number,
    entriesDTO: IManualJournalEntry[]
  ): Promise<any> {
    return Promise.all([
      this.validateAccountWithContactType(
        tenantId,
        entriesDTO,
        'accounts-receivable',
        'customer'
      ),
      this.validateAccountWithContactType(
        tenantId,
        entriesDTO,
        'accounts-payable',
        'vendor'
      ),
    ]).then((results) => {
      const metadataErrors = results
        .filter((result) => result instanceof ServiceError)
        .map((result: ServiceError) => result.payload);

      if (metadataErrors.length > 0) {
        throw new ServiceError(
          ERRORS.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT,
          '',
          metadataErrors
        );
      }

      return results;
    });
  }

  /**
   * Validate entries contacts existance.
   * @param {number} tenantId -
   * @param {IManualJournalDTO} manualJournalDTO
   */
  public async validateContactsExistance(
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
      const storedContacts = await contactRepository.findWhereIn(
        'id',
        entriesContactsIds
      );
      // Converts the stored contacts to map with id as key and entry as value.
      const storedContactsMap = new Map(
        storedContacts.map((contact) => [contact.id, contact])
      );
      const notFoundContactsIds = [];

      entriesContactPairs.forEach((contactEntry) => {
        const storedContact = storedContactsMap.get(contactEntry.contactId);

        // in case the contact id not found.
        if (!storedContact) {
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
   * Validates expenses is not already published before.
   * @param {IManualJournal} manualJournal
   */
  public validateManualJournalIsNotPublished(manualJournal: IManualJournal) {
    if (manualJournal.publishedAt) {
      throw new ServiceError(ERRORS.MANUAL_JOURNAL_ALREADY_PUBLISHED);
    }
  }

  /**
   * Validates the manual journal number require.
   * @param {string} journalNumber
   */
  public validateJournalNoRequireWhenAutoNotEnabled = (
    tenantId: number,
    journalNumber: string
  ) => {
    // Retrieve the next manual journal number.
    const autoIncrmenetEnabled =
      this.autoIncrement.autoIncrementEnabled(tenantId);

    if (!journalNumber || !autoIncrmenetEnabled) {
      throw new ServiceError(ERRORS.MANUAL_JOURNAL_NO_REQUIRED);
    }
  };

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
   *
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   */
  public validateJournalCurrencyWithAccountsCurrency = async (
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    baseCurrency: string
  ) => {
    const { Account } = this.tenancy.models(tenantId);

    const accountsIds = manualJournalDTO.entries.map((e) => e.accountId);
    const accounts = await Account.query().whereIn('id', accountsIds);

    // Filters the accounts that has no base currency or DTO currency.
    const notSupportedCurrency = accounts.filter((account) => {
      if (
        account.currencyCode === baseCurrency ||
        account.currencyCode === manualJournalDTO.currencyCode
      ) {
        return false;
      }
      return true;
    });
    if (notSupportedCurrency.length > 0) {
      throw new ServiceError(
        ERRORS.COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS
      );
    }
  };
}
