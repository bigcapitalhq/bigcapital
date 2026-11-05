import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import * as moment from 'moment';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { SaleInvoice } from '../../models/SaleInvoice';
import { SaleInvoiceWriteoffGL } from './SaleInvoiceWriteoffGL';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SaleInvoiceWriteoffGLStorage {
  /**
   * @param {LedgerStorageService} ledgerStorage - Ledger storage service.
   * @param {AccountRepository} accountRepository - Account repository.
   * @param {Account} accountModel - Account model.
   * @param {SaleInvoice} saleInvoiceModel - Sale invoice model.
   * @param {AccountTransaction} accountTransactionModel - Account transaction model.
   */
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,
  ) {}

  /**
   * Retrieves the date of the stored invoice write-off GL entries, which is
   * the date that reverting them changes. Write-offs posted before the
   * entries were dated on the write-off date still carry the invoice date.
   * Falls back to the stored write-off date when no entries are stored.
   * @param {SaleInvoice} saleInvoice - The written-off sale invoice.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<string>} The entries date (YYYY-MM-DD).
   */
  public async getWriteoffEntryDate(
    saleInvoice: SaleInvoice,
    trx?: Knex.Transaction,
  ): Promise<string> {
    const entry = await this.accountTransactionModel()
      .query(trx)
      .modify('filterByReference', saleInvoice.id, 'InvoiceWriteOff')
      .orderBy('date')
      .first();

    return moment(entry?.date ?? saleInvoice.writtenoffAt).format('YYYY-MM-DD');
  }

  /**
   * Writes the invoice write-off GL entries.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async writeInvoiceWriteoffEntries(
    saleInvoiceId: number,
    trx?: Knex.Transaction,
  ) {
    // Retrieves the sale invoice.
    const saleInvoice = await this.saleInvoiceModel()
      .query(trx)
      .findById(saleInvoiceId)
      .withGraphFetched('writtenoffExpenseAccount');

    // Find or create the A/R account.
    const ARAccount =
      await this.accountRepository.findOrCreateAccountReceivable(
        saleInvoice.currencyCode,
        {},
        trx,
      );
    const ledger = new SaleInvoiceWriteoffGL(saleInvoice)
      .setARAccountId(ARAccount.id)
      .getInvoiceWriteoffLedger();

    return this.ledgerStorage.commit(ledger, trx);
  }

  /**
   * Rewrites the invoice write-off GL entries.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async rewriteInvoiceWriteoffEntries(
    saleInvoiceId: number,
    trx?: Knex.Transaction,
  ) {
    await this.revertInvoiceWriteoffEntries(saleInvoiceId, trx);
    await this.writeInvoiceWriteoffEntries(saleInvoiceId, trx);
  }

  /**
   * Reverts the invoice write-off GL entries.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public revertInvoiceWriteoffEntries = async (
    saleInvoiceId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      saleInvoiceId,
      'InvoiceWriteOff',
      trx,
    );
  };
}
