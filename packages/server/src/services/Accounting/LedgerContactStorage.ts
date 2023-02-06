import { Service, Inject } from 'typedi';
import async from 'async';
import { Knex } from 'knex';
import { ILedger, ISaleContactsBalanceQueuePayload } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';

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
    const contact = await Contact.query().findById(contactId);

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });
    
    // Detarmines whether the contact has foreign currency.
    const isForeignContact = contact.currencyCode !== tenantMeta.baseCurrency;

    // Filters the ledger base on the given contact id.
    const contactLedger = ledger.whereContactId(contactId);

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
