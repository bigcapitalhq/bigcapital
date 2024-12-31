import async from 'async';
import { Knex } from 'knex';
import {
  ILedger,
  ILedgerEntry,
  ISaleContactsBalanceQueuePayload,
} from './types/Ledger.types';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '../Contacts/models/Contact';
import { Account } from '../Accounts/models/Account.model';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Injectable()
export class LedgerContactsBalanceStorage {
  constructor(
    private tenancyContext: TenancyContext,

    @Inject(Contact.name)
    private contactModel: typeof Contact,

    @Inject(Account.name)
    private accountModel: typeof Account,
  ) {}

  /**
   * Saves the contacts balance.
   * @param {ILedger} ledger
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public saveContactsBalance = async (
    ledger: ILedger,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Save contact balance queue.
    const saveContactsBalanceQueue = async.queue(
      this.saveContactBalanceTask,
      10,
    );
    // Retrieves the effected contacts ids.
    const effectedContactsIds = ledger.getContactsIds();

    effectedContactsIds.forEach((contactId: number) => {
      saveContactsBalanceQueue.push({ contactId, ledger, trx });
    });
    if (effectedContactsIds.length > 0) await saveContactsBalanceQueue.drain();
  };

  /**
   * Saves the contact balance.
   * @param {ISaleContactsBalanceQueuePayload} task
   * @returns {Promise<void>}
   */
  private saveContactBalanceTask = async (
    task: ISaleContactsBalanceQueuePayload,
  ) => {
    const { contactId, ledger, trx } = task;

    await this.saveContactBalance(ledger, contactId, trx);
  };

  /**
   * Filters AP/AR ledger entries.
   * @param {number} tenantId
   * @param {Knex.Transaction} trx
   * @returns {Promise<(entry: ILedgerEntry) => boolean>}
   */
  private filterARAPLedgerEntris = async (
    trx?: Knex.Transaction,
  ): Promise<(entry: ILedgerEntry) => boolean> => {
    const ARAPAccounts = await this.accountModel
      .query(trx)
      .whereIn('accountType', [
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
   * @param {number} tenantId
   * @param {ILedger} ledger
   * @param {number} contactId
   * @returns {Promise<void>}
   */
  private saveContactBalance = async (
    ledger: ILedger,
    contactId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const contact = await this.contactModel.query(trx).findById(contactId);
    const tenant = await this.tenancyContext.getTenant(true);

    // Detarmines whether the contact has foreign currency.
    const isForeignContact =
      contact.currencyCode !== tenant?.metadata.baseCurrency;

    // Filters the ledger base on the given contact id.
    const filterARAPLedgerEntris = await this.filterARAPLedgerEntris(trx);
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

    await this.changeContactBalance(contactId, closingBalance, trx);
  };

  /**
   * Changes the contact receiable/payable balance.
   * @param {number} contactId - The contact ID.
   * @param {number} change - The change amount.
   * @returns {Promise<void>}
   */
  private changeContactBalance = (
    contactId: number,
    change: number,
    trx?: Knex.Transaction,
  ) => {
    // return this.contactModel.changeAmount(
    //   { id: contactId },
    //   'balance',
    //   change,
    //   trx,
    // );
  };
}
