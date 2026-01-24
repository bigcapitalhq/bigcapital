import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { VendorGLEntries } from './VendorGLEntries';
import { Vendor } from './models/Vendor';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class VendorGLEntriesStorage {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,
    private readonly vendorGLEntries: VendorGLEntries,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) { }

  /**
   * Vendor opening balance journals.
   * @param {number} vendorId
   * @param {Knex.Transaction} trx
   */
  public writeVendorOpeningBalance = async (
    vendorId: number,
    trx?: Knex.Transaction,
  ) => {
    const vendor = await this.vendorModel()
      .query(trx)
      .findById(vendorId);

    // Finds the expense account.
    const expenseAccount = await this.accountRepository.findOrCreateOtherExpensesAccount(
      {},
      trx,
    );
    // Find or create the A/P account.
    const APAccount =
      await this.accountRepository.findOrCreateAccountsPayable(
        vendor.currencyCode,
        {},
        trx,
      );
    // Retrieves the vendor opening balance ledger.
    const ledger = this.vendorGLEntries.getOpeningBalanceLedger(
      APAccount.id,
      expenseAccount.id,
      vendor,
    );
    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts the vendor opening balance GL entries.
   * @param {number} vendorId
   * @param {Knex.Transaction} trx
   */
  public revertVendorOpeningBalance = async (
    vendorId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      vendorId,
      'VendorOpeningBalance',
      trx,
    );
  };

  /**
   * Writes the vendor opening balance GL entries.
   * @param {number} vendorId
   * @param {Knex.Transaction} trx
   */
  public rewriteVendorOpeningBalance = async (
    vendorId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the vendor opening balance entries first.
    await this.revertVendorOpeningBalance(vendorId, trx);

    // Write the vendor opening balance entries.
    await this.writeVendorOpeningBalance(vendorId, trx);
  };
}
