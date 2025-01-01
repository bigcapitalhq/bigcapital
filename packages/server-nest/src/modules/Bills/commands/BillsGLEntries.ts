import { Knex } from 'knex';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { Bill } from '../models/Bill';
import { Inject, Injectable } from '@nestjs/common';
import { BillGL } from './BillsGL';

@Injectable()
export class BillGLEntries {
  /**
   * @param {LedgerStorageService} ledgerStorage - Ledger storage service.
   * @param {AccountRepository} accountRepository - Account repository.
   * @param {typeof Bill} billModel - Bill model.
   */
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,

    @Inject(Bill.name)
    private readonly billModel: typeof Bill,
  ) {}

  /**
   * Creates bill GL entries.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public writeBillGLEntries = async (
    billId: number,
    trx?: Knex.Transaction,
  ) => {
    // Retrieves bill with associated entries and landed costs.
    const bill = await this.billModel
      .query(trx)
      .findById(billId)
      .withGraphFetched('entries.item')
      .withGraphFetched('entries.allocatedCostEntries')
      .withGraphFetched('locatedLandedCosts.allocateEntries');

    // Finds or create a A/P account based on the given currency.
    const APAccount = await this.accountRepository.findOrCreateAccountsPayable(
      bill.currencyCode,
      {},
      trx,
    );
    // Find or create tax payable account.
    const taxPayableAccount =
      await this.accountRepository.findOrCreateTaxPayable({}, trx);

    // Find or create other expenses account.
    const otherExpensesAccount =
      await this.accountRepository.findOrCreateOtherExpensesAccount({}, trx);

    // Find or create purchase discount account.
    const purchaseDiscountAccount =
      await this.accountRepository.findOrCreatePurchaseDiscountAccount({}, trx);

    // Retrieves the bill ledger.
    const billLedger = new BillGL(bill)
      .setPayableAccountId(APAccount.id)
      .setTaxPayableAccountId(taxPayableAccount.id)
      .setPurchaseDiscountAccountId(purchaseDiscountAccount.id)
      .setOtherExpensesAccountId(otherExpensesAccount.id)
      .getBillLedger();

    // Commit the GL enties on the storage.
    await this.ledgerStorage.commit(billLedger, trx);
  };

  /**
   * Reverts the given bill GL entries.
   * @param {number} tenantId
   * @param {number} billId
   * @param {Knex.Transaction} trx
   */
  public revertBillGLEntries = async (
    billId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(billId, 'Bill', trx);
  };

  /**
   * Rewrites the given bill GL entries.
   * @param {number} tenantId
   * @param {number} billId
   * @param {Knex.Transaction} trx
   */
  public rewriteBillGLEntries = async (
    billId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the bill GL entries.
    await this.revertBillGLEntries(billId, trx);

    // Writes the bill GL entries.
    await this.writeBillGLEntries(billId, trx);
  };
}
