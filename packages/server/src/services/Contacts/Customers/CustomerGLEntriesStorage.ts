import { Knex } from 'knex';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';
import { CustomerGLEntries } from './CustomerGLEntries';

@Service()
export class CustomerGLEntriesStorage {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerRepository: LedgerStorageService;

  @Inject()
  private customerGLEntries: CustomerGLEntries;

  /**
   * Customer opening balance journals.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {Knex.Transaction} trx
   */
  public writeCustomerOpeningBalance = async (
    tenantId: number,
    customerId: number,
    trx?: Knex.Transaction
  ) => {
    const { Customer } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const customer = await Customer.query(trx).findById(customerId);

    // Finds the income account.
    const incomeAccount = await accountRepository.findOne({
      slug: 'other-income',
    });
    // Find or create the A/R account.
    const ARAccount = await accountRepository.findOrCreateAccountReceivable(
      customer.currencyCode,
      {},
      trx
    );
    // Retrieves the customer opening balance ledger.
    const ledger = this.customerGLEntries.getCustomerOpeningLedger(
      ARAccount.id,
      incomeAccount.id,
      customer
    );
    // Commits the ledger entries to the storage.
    await this.ledgerRepository.commit(tenantId, ledger, trx);
  };

  /**
   * Reverts the customer opening balance GL entries.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {Knex.Transaction} trx
   */
  public revertCustomerOpeningBalance = async (
    tenantId: number,
    customerId: number,
    trx?: Knex.Transaction
  ) => {
    await this.ledgerRepository.deleteByReference(
      tenantId,
      customerId,
      'CustomerOpeningBalance',
      trx
    );
  };

  /**
   * Writes the customer opening balance GL entries.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {Knex.Transaction} trx
   */
  public rewriteCustomerOpeningBalance = async (
    tenantId: number,
    customerId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the customer opening balance entries.
    await this.revertCustomerOpeningBalance(tenantId, customerId, trx);

    // Write the customer opening balance entries.
    await this.writeCustomerOpeningBalance(tenantId, customerId, trx);    
  };
}
