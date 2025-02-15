import { Knex } from 'knex';
import { VendorCreditGL } from './VendorCreditGL';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { VendorCredit } from '../models/VendorCredit';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class VendorCreditGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Creates vendor credit associated GL entries.
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  public writeVendorCreditGLEntries = async (
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ) => {
    // Vendor credit with entries items.
    const vendorCredit = await this.vendorCreditModel()
      .query(trx)
      .findById(vendorCreditId)
      .withGraphFetched('entries.item');

    // Retrieve the payable account (A/P) account.
    const APAccount = await this.accountRepository.findOrCreateAccountsPayable(
      vendorCredit.currencyCode,
      {},
      trx,
    );
    // Retrieve the purchase discount account.
    const purchaseDiscountAccount =
      await this.accountRepository.findOrCreatePurchaseDiscountAccount({}, trx);

    // Retrieve the other expenses account.
    const otherExpensesAccount =
      await this.accountRepository.findOrCreateOtherExpensesAccount({}, trx);

    const vendorCreditLedger = new VendorCreditGL(vendorCredit)
      .setAPAccountId(APAccount.id)
      .setPurchaseDiscountAccountId(purchaseDiscountAccount.id)
      .setOtherExpensesAccountId(otherExpensesAccount.id)
      .getVendorCreditLedger();

    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(vendorCreditLedger, trx);
  };

  /**
   * Edits vendor credit associated GL entries.
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  public rewriteVendorCreditGLEntries = async (
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the GL entries.
    await this.revertVendorCreditGLEntries(vendorCreditId, trx);

    // Re-write the GL entries.
    await this.writeVendorCreditGLEntries(vendorCreditId, trx);
  };

  /**
   * Reverts the vendor credit associated GL entries.
   * @param {number} vendorCreditId - Vendor credit identifier.
   * @param {Knex.Transaction} trx
   */
  public async revertVendorCreditGLEntries(
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.ledgerStorage.deleteByReference(
      vendorCreditId,
      'VendorCredit',
      trx,
    );
  }
}
