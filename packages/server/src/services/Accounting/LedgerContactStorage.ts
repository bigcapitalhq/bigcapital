import { Service, Inject } from 'typedi';
import async from 'async';
import { Knex } from 'knex';
import {
  ILedger,
  ILedgerEntry,
  ISaleContactsBalanceQueuePayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

@Service()
export class LedgerContactsBalanceStorage {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   *
   * @param   {number} tenantId -
   * @param   {ILedger} ledger -
   * @param   {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  public saveContactsBalance = async (
    tenantId: number,
    ledger: ILedger,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Save contact balance queue.
    const saveContactsBalanceQueue = async.queue(
      this.saveContactBalanceTask,
      10
    );
    // Retrieves the effected contacts ids.
    const effectedContactsIds = ledger.getContactsIds();

    effectedContactsIds.forEach((contactId: number) => {
      saveContactsBalanceQueue.push({ tenantId, contactId, ledger, trx });
    });
    if (effectedContactsIds.length > 0) await saveContactsBalanceQueue.drain();
  };

  /**
   *
   * @param   {ISaleContactsBalanceQueuePayload} task
   * @returns {Promise<void>}
   */
  private saveContactBalanceTask = async (
    task: ISaleContactsBalanceQueuePayload
  ) => {
    const { tenantId, contactId, ledger, trx } = task;

    await this.saveContactBalance(tenantId, ledger, contactId, trx);
  };

  /**
   * Filters AP/AR ledger entries.
   * @param {number} tenantId
   * @param {Knex.Transaction} trx
   * @returns {Promise<(entry: ILedgerEntry) => boolean>}
   */
  private filterARAPLedgerEntris = async (
    tenantId: number,
    trx?: Knex.Transaction
  ): Promise<(entry: ILedgerEntry) => boolean> => {
    const { Account } = this.tenancy.models(tenantId);

    const ARAPAccounts = await Account.query(trx).whereIn('accountType', [
      ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE,
      ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
    ]);
    const ARAPAccountsIds = ARAPAccounts.map((a) => a.id);

    return (entry: ILedgerEntry) => {
      return ARAPAccountsIds.indexOf(entry.accountId) !== -1;
    };
  };

  /**
   *
   * @param   {number} tenantId
   * @param   {ILedger} ledger
   * @param   {number} contactId
   * @returns {Promise<void>}
   */
  private saveContactBalance = async (
    tenantId: number,
    ledger: ILedger,
    contactId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { Contact } = this.tenancy.models(tenantId);
    const contact = await Contact.query(trx).findById(contactId);

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Detarmines whether the contact has foreign currency.
    const isForeignContact = contact.currencyCode !== tenantMeta.baseCurrency;

    // Filters the ledger base on the given contact id.
    const filterARAPLedgerEntris = await this.filterARAPLedgerEntris(
      tenantId,
      trx
    );
    const contactLedger = ledger
      // Filter entries only that have contact id.
      .whereContactId(contactId)
      // Filter entries on AR/AP accounts.
      .filter(filterARAPLedgerEntris);

    const closingBalance = isForeignContact
      ? contactLedger
          .whereCurrencyCode(contact.currencyCode)
          .getForeignClosingBalance()
      : contactLedger.getClosingBalance();

    await this.changeContactBalance(tenantId, contactId, closingBalance, trx);
  };

  /**
   *
   * @param {number} tenantId
   * @param {number} contactId
   * @param {number} change
   * @returns
   */
  private changeContactBalance = (
    tenantId: number,
    contactId: number,
    change: number,
    trx?: Knex.Transaction
  ) => {
    const { Contact } = this.tenancy.models(tenantId);

    return Contact.changeAmount({ id: contactId }, 'balance', change, trx);
  };
}
