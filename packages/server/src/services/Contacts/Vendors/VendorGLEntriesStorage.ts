import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { VendorGLEntries } from './VendorGLEntries';

@Service()
export class VendorGLEntriesStorage {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerRepository: LedgerStorageService;

  @Inject()
  private vendorGLEntries: VendorGLEntries;

  /**
   * Vendor opening balance journals.
   * @param {number} tenantId
   * @param {number} vendorId
   * @param {Knex.Transaction} trx
   */
  public writeVendorOpeningBalance = async (
    tenantId: number,
    vendorId: number,
    trx?: Knex.Transaction
  ) => {
    const { Vendor } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const vendor = await Vendor.query(trx).findById(vendorId);

    // Finds the expense account.
    const expenseAccount = await accountRepository.findOne({
      slug: 'other-expenses',
    });
    // Find or create the A/P account.
    const APAccount = await accountRepository.findOrCreateAccountsPayable(
      vendor.currencyCode,
      {},
      trx
    );
    // Retrieves the vendor opening balance ledger.
    const ledger = this.vendorGLEntries.getOpeningBalanceLedger(
      APAccount.id,
      expenseAccount.id,
      vendor
    );
    // Commits the ledger entries to the storage.
    await this.ledgerRepository.commit(tenantId, ledger, trx);
  };

  /**
   * Reverts the vendor opening balance GL entries.
   * @param {number} tenantId
   * @param {number} vendorId
   * @param {Knex.Transaction} trx
   */
  public revertVendorOpeningBalance = async (
    tenantId: number,
    vendorId: number,
    trx?: Knex.Transaction
  ) => {
    await this.ledgerRepository.deleteByReference(
      tenantId,
      vendorId,
      'VendorOpeningBalance',
      trx
    );
  };

  /**
   * Writes the vendor opening balance GL entries.
   * @param {number} tenantId
   * @param {number} vendorId
   * @param {Knex.Transaction} trx
   */
  public rewriteVendorOpeningBalance = async (
    tenantId: number,
    vendorId: number,
    trx?: Knex.Transaction
  ) => {
    await this.writeVendorOpeningBalance(tenantId, vendorId, trx);

    await this.revertVendorOpeningBalance(tenantId, vendorId, trx);
  };
}
